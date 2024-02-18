import argparse
import json
import uuid
import requests
from openai import OpenAI
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from sklearn.cluster import DBSCAN
import numpy as np

load_dotenv(override=True)

BIAS_URL = "https://api-inference.huggingface.co/models/d4data/bias-detection-model"
SENTIMENT_URL = "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis"
API_TOKEN = os.environ.get("HUGGING_FACE_TOKEN")
headers = {"Authorization": f"Bearer {API_TOKEN}"}

client = OpenAI(
    api_key = os.environ.get("OPENAI_API_KEY"),
)

model = SentenceTransformer('all-MiniLM-L6-v2')


def fetch_article(url):
    if url.isdigit():
        # get the first article in the folder based on the index passed in
        url = os.listdir('articles')[int(url)]

    # Hacky way to get around paywalls
    filename = 'articles/' + f"{url.replace('/', '_')}"
    print('filename: ', filename)
    try:
        with open(filename, 'r') as f:
            lines = f.read().split('\n')
            title, article = lines[0].replace('TITLE: ', ''), '\n'.join(lines[1:])
            return title, article
    except FileNotFoundError:
        print('Article not found.')

def detect_bias(input):
    try:
        response = requests.post(BIAS_URL, headers=headers, json={
            "inputs": input,
            "options": {
                "wait_for_model": True
            }
        })
        if response.status_code != 200:
            print(f'BIAS {response.status_code}: ', response.json())
            exit(1)
        bias = response.json()[0][0]['score']
    except Exception as e:
        print('BIAS ERROR: ', str(e))
        exit(1)

    return bias

def detect_sentiment(input):
    try:
        response = requests.post(SENTIMENT_URL, headers=headers, json={
            "inputs": input,
            "options": {
                "wait_for_model": True
            }
        })
        if response.status_code != 200:
            print(f'SENTIMENT {response.status_code}: ', response.json())
            exit(1)
        sentiment = {}
        for obj in response.json()[0]:
            sentiment[obj['label']] = obj['score']
    except Exception as e:
        print('SENTIMENT ERROR: ', str(e))
        exit(1)

    return sentiment

def embed_text(text):
    return model.encode(text, normalize_embeddings=True).tolist()

def post_article(article):
    try:
        article = { "id": str(uuid.uuid4()), **article }
        payload = {
            'sql': "INSERT INTO articles (id, title, url, bias, sentiment, embedding) VALUES (:id, :title, :url, :bias, :sentiment, TO_VECTOR(:embedding))",
            'params': article
        }
        response = requests.post('http://127.0.0.1:5000/execute_sql', json=payload)
        if response.status_code != 200:
            print(f'ARTICLE {response.status_code}: ', response.json())
            exit(1)
        return article
    except Exception as e:
        print('ARTICLE ERROR: ', str(e))
        exit(1)

def post_specific_point(point):
    try:
        point = { "id": str(uuid.uuid4()), "superset_point_id": "", **point }
        payload = {
            "sql": "INSERT INTO specific_points (id, article_id, original_excerpt, embedding, bias, sentiment, superset_point_id) VALUES (:id, :article_id, :original_excerpt, TO_VECTOR(:embedding), :bias, :sentiment, :superset_point_id)",
            "params": point
        }
        response = requests.post('http://127.0.0.1:5000/execute_sql', json=payload)
        if response.status_code != 200:
            print(f'SPECIFIC {response.status_code}: ', response.json())
            exit(1)
        return point
    except Exception as e:
        print('SPECIFIC ERROR: ', str(e))
        exit(1)

def update_with_superset_point(specific_point_id, superset_point_id):
    try:
        payload = {
            "sql": "UPDATE specific_points SET superset_point_id = :superset_point_id WHERE id = :id",
            "params": {
                "id": specific_point_id,
                "superset_point_id": superset_point_id,
            }
        }
        response = requests.post('http://127.0.0.1:5000/execute_sql', json=payload)
        if response.status_code != 200:
            print(f'UPDATE {response.status_code}: ', response.json())
            exit(1)
    except Exception as e:
        print('UPDATE ERROR: ', str(e))
        exit(1)


def post_superset_point(point):
    try:
        point = { "id": str(uuid.uuid4()), **point }
        payload = {
            "sql": "INSERT INTO superset_points (id, title_generated, embedding) VALUES (:id, :title_generated, TO_VECTOR(:embedding))",
            "params": point
        }
        response = requests.post('http://127.0.0.1:5000/execute_sql', json=payload)
        if response.status_code != 200:
            print(f'SUPERSET {response.status_code}: ', response.json())
            exit(1)
        return point
    except Exception as e:
        print('SUPERSET ERROR: ', e.message)
        exit(1)

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

def get_clusters(embeddings):
    clusterer = DBSCAN(eps=0.999, min_samples=1, metric='euclidean')
    cluster_labels = clusterer.fit_predict(embeddings)
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
                Strings: {"-BREAK BETWEEN STRINGS-".join(texts)[:1000]}""",
            }
        ],
        model="gpt-3.5-turbo-1106",
      )

    summary = response.choices[0].message.content
    return summary

def search_vector(vector):
    try:
        payload = {
            'search_vector': vector,
        }
        response = requests.post('http://127.0.0.1:5000/search', json=payload)
        if response.status_code != 200:
            print(f'SEARCH {response.status_code}: ', response.json())
            exit(1)
        return response.json()
    except Exception as e:
        print('SEARCH ERROR: ', str(e))
        exit(1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('url', help='The article to load')
    args = parser.parse_args()

    title, article = fetch_article(args.url)
    article_bias = detect_bias(article[:2048])
    article_sentiment = detect_sentiment(article[:512])

    article_obj = {
        "title": title,
        "url": args.url,
        "bias": article_bias,
        "sentiment": str(article_sentiment),
        "embedding": str(embed_text(article)),
    }
    article_obj = post_article(article_obj)
    
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
                "content": f"{article}",
            }
        ],
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" }
    )

    topics = response.choices[0].message.content
    data_json = json.loads(topics)

    specific_points = []
    for topic in data_json["topics"][:3]:
        point = post_specific_point({
            "article_id": article_obj["id"],
            "original_excerpt": topic,
            "bias": detect_bias(topic),
            "sentiment": str(detect_sentiment(topic)),
            "embedding": str(embed_text(topic)),
        })
        specific_points.append(point)

    embeddings = []
    printed_texts = []
    for specific_point in specific_points:
        embeddings.append(json.loads(specific_point["embedding"]))
        printed_texts.append(specific_point["original_excerpt"])

    cluster_labels, num_clusters = get_clusters(embeddings)

    grouped_points_by_cluster = [[] for _ in range(num_clusters)]
    for i in range(len(specific_points)):
        cluster_label = cluster_labels[i]
        specific_point = specific_points[i]
        grouped_points_by_cluster[cluster_label].append(specific_point)
    
    cluster_summaries = []
    for grouped_points in grouped_points_by_cluster:
        original_excerpts = []
        for point in grouped_points:
            original_excerpts.append(point["original_excerpt"])

        cluster_summary = get_cluster_summary(original_excerpts)
        cluster_summaries.append(cluster_summary)

    superset_points = {}
    for i, cluster_summary in enumerate(cluster_summaries):
        superset_point = post_superset_point({
            "title_generated": cluster_summary,
            "embedding": str(embed_text(cluster_summary))
        })
        superset_points[i] = superset_point

    for i, grouped_points in enumerate(grouped_points_by_cluster):
        for point in grouped_points:
            update_with_superset_point(point['id'], superset_points[i]['id'])

    for specific_point in specific_points:
        print(specific_point['original_excerpt'])
        print(search_vector(json.loads(specific_point['embedding'])))
        print()

if __name__ == '__main__':
    main()
