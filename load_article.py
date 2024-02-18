import argparse
import json
import uuid
import requests
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
            "inputs": input
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
            "inputs": input
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
            'sql': "INSERT INTO articles (id, title, url, bias, sentiment, embedding) VALUES (:id, :title, :url, :bias, :sentiment, :embedding)",
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
            "sql": "INSERT INTO specific_points (id, article_id, original_excerpt, embedding, bias, sentiment, superset_point_id) VALUES (:id, :article_id, :original_excerpt, :embedding, :bias, :sentiment, :superset_point_id)",
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

def post_superset_point(point):
    try:
        point = { "id": str(uuid.uuid4()), **point }
        payload = {
            "sql": "INSERT INTO superset_points (id, title_generated, embedding) VALUES (:id, :title_generated, :embedding)",
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
        "sentiment": json.dumps(article_sentiment),
        "embedding": json.dumps(embed_text(article)),
    }
    article_obj = post_article(article_obj)
    
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
    )

    topics = response.choices[0].message.content.split('\n')
    specific_points = []
    for topic in [topics[0]]:
        assert len(topic) <= 512
        specific_points.append({
            "article_id": article_obj["id"],
            "original_excerpt": topic,
            "bias": detect_bias(topic),
            "sentiment": json.dumps(detect_sentiment(topic)),
            "embedding": json.dumps(embed_text(topic)),
        })
    for point in specific_points:
        post_specific_point(point)

    
if __name__ == '__main__':
    main()
