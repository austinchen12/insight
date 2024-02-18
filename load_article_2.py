from openai import OpenAI
import json
import os
from dotenv import load_dotenv
import requests
from sentence_transformers import SentenceTransformer
import hdbscan
import numpy as np
import time

load_dotenv(override=True)

BIAS_URL = "https://api-inference.huggingface.co/models/d4data/bias-detection-model"
SENTIMENT_URL = "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis"
API_TOKEN = os.environ.get("HUGGING_FACE_TOKEN")
headers = {"Authorization": f"Bearer {API_TOKEN}"}

client = OpenAI(
    api_key = os.environ.get("OPENAI_API_KEY"),
)

model = SentenceTransformer('all-MiniLM-L6-v2')


def detect_bias(input):
    try:
        response = requests.post(BIAS_URL, headers=headers, json={
            "inputs": input
        })

        if response is None:
            print("SLEEPING FOR 10...")
            time.sleep(10)
            # Call it again
            return detect_bias(input)

        responseJson = response.json()
        print("responseJson", responseJson)
        bias = responseJson[0][0]['score']
    except Exception as e:
        print('BIAS ERROR: ', str(e))
        exit(1)

    return bias

def detect_sentiment(input):
    try:
        response = requests.post(SENTIMENT_URL, headers=headers, json={
            "inputs": input
        })
        sentiment = {}
        for obj in response.json()[0]:
            sentiment[obj['label']] = obj['score']
    except Exception as e:
        print('SENTIMENT ERROR: ', str(e))
        exit(1)

    return sentiment

def embed_text(text):
    return model.encode(text, normalize_embeddings=True).tolist()

def find_markdown_files(root_directory):
    """Walk through the directories to find all Markdown files."""
    markdown_files = []
    for dirpath, dirnames, files in os.walk(root_directory):
        for file in files:
            if file.endswith('.md'):
                markdown_files.append(os.path.join(dirpath, file))
    return markdown_files

def read_markdown_file(file_path):
    """Read and return the content of a Markdown file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
          return file.read()
    except:
        print("Error", file_path)


def get_specific_points(file_contents):
    specific_points = []

    for file in file_contents:

      response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": """You are a politically neutral reader that want's to help other people identify potential biases in the media they ingest. 
                You will be given articles that people have read and I want you to identify the key topics of this article. 
                Topics should be sentences rather than a list of words. Response should be word for word from the original text and be formatted as a single string with topics separated by a new line character.
                  Do not prefix your response with any special characters like a dash.

                  Shoot for 3-5 topics, and only the most broad nad important ones.
                  
                  Your output type is a JSON LIST of strings of these chunks of original text, each one being a unique important topic.
                  
                  Example:{ topics:["topic 1", "topic 2", "topic 3", ]}""",
            },
            {
                "role": "user",
                "content": f"{file}",
            }
        ],
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" }
      )

      topics = response.choices[0].message.content
      data_json = json.loads(topics)
      
      for topic in data_json["topics"]:
          specific_points.append({
              # "article_id": article_obj["id"],
              "original_excerpt": topic,
              "bias": detect_bias(topic),
              "sentiment": detect_sentiment(topic),
              "embedding": embed_text(topic)
          })
      
    return specific_points



def get_clusters(embeddings):
  clusterer = hdbscan.HDBSCAN()
  clusterer.fit(embeddings)
  cluster_labels = clusterer.labels_
  
  # Points that are not clustered with anything else are returned as -1, so we need to make them their own label instead
  max_label = max(cluster_labels)

  # Replace each -1 with a new unique label
  new_cluster_labels = []
  next_new_label = max_label + 1
  for label in cluster_labels:
      if label == -1:
          new_cluster_labels.append(next_new_label)
          next_new_label += 1
      else:
          new_cluster_labels.append(label)

  # Convert the list back to a numpy array if needed
  new_cluster_labels = np.array(new_cluster_labels)
  num_clusters = max(new_cluster_labels) + 1

  return new_cluster_labels, num_clusters

def get_cluster_summary(texts):
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""Summarize all of the following strings (which should be related to each other) into one 5-10 word sentence. Only return the string and no other text at all.
                Strings: {"-BREAK BETWEEN STRINGS-".join(texts)}""",
            }
        ],
        model="gpt-3.5-turbo-1106",
      )

    summary = response.choices[0].message.content
    return summary

# This is run by hand for each of the 4 directories.
def main():
    
    # Read data
    directories_to_search = ['articles/Trump Election Fraud']  
    file_contents = []
    
    for directory in directories_to_search:
        markdown_files = find_markdown_files(directory)
        for file_path in markdown_files:
            content = read_markdown_file(file_path)
            file_contents.append(content)

    print(len(file_contents))
  
    specific_points = get_specific_points(file_contents)

    # Put these in database for specific points

    # Cluster the embeddings
    embeddings = []
    for specific_point in specific_points:
        embeddings.append(specific_point["embedding"])
    
    cluster_labels, num_clusters = get_clusters(embeddings)

    print("cluster_labels", cluster_labels)

    # Group by cluster
    grouped_points_by_cluster = [[] for _ in range(num_clusters)]
    for i in range(len(specific_points)):
        cluster_label = cluster_labels[i]
        specific_point = specific_points[i]
        grouped_points_by_cluster[cluster_label].append(specific_point)
    
    # Get summary text for each cluster
    cluster_summaries = []
    for grouped_points in grouped_points_by_cluster:
        original_excerpts = []
        for point in grouped_points:
            original_excerpts.append(point["original_excerpt"])
        
        cluster_summary = get_cluster_summary(original_excerpts)
        cluster_summaries.append(cluster_summary)

    print("cluster_summaries", cluster_summaries)

    # Push cluster summaries to the database
    
    

    

    
if __name__ == '__main__':
    main()
