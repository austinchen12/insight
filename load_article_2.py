from openai import OpenAI
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv(override=True)

BIAS_URL = "https://api-inference.huggingface.co/models/d4data/bias-detection-model"
SENTIMENT_URL = "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis"
API_TOKEN = os.environ.get("HUGGING_FACE_TOKEN")
headers = {"Authorization": f"Bearer {API_TOKEN}"}

client = OpenAI(
    api_key = os.environ.get("OPENAI_API_KEY"),
)

model = SentenceTransformer('all-MiniLM-L6-v2')


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
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()


def main():
    directories_to_search = ['articles/Trump Election Fraud']  
    markdown_files = []
    
    for directory in directories_to_search:
        markdown_files = find_markdown_files(directory)
        for file_path in markdown_files:
            content = read_markdown_file(file_path)
            markdown_files.append(content)
            
    print(len(markdown_files))
    return
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"You are a politically neutral reader that want's to help other people identify potential biases in the media they ingest. You will be given articles that people have read and I want you to identify the key topics of this article. Topics should be sentences rather than a list of words. Response should be word for word from the original text and be formatted as a single string with topics separated by a new line character. Do not prefix your response with any special characters like a dash.",
            },
            {
                "role": "user",
                "content": f"{article}",
            }
        ],
        model="gpt-3.5-turbo",
        response_format={ "type": "json_object" }
    )

    topics = response.choices[0].message.content.split('\n')
    specific_points = []
    for topic in topics:
        print('topic', topic)
        assert len(topic) <= 512
        specific_points.append({
            "article_id": article_obj["id"],
            "original_excerpt": topic,
            "bias": detect_bias(topic),
            "sentiment": detect_sentiment(topic),
            "embedding": embed_text(topic)
        })
    for point in specific_points:
        post_specific_point(point)

    
if __name__ == '__main__':
    main()
