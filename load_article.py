import argparse
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
        bias = response.json()[0][0]['score']
    except Exception as e:
        print('BIAS ERROR: ', e.message)
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
        print('SENTIMENT ERROR: ', e.message)
        exit(1)

    return sentiment

def embed_text(text):
    return model.encode(text, normalize_embeddings=True).tolist()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('url', help='The article to load')
    args = parser.parse_args()

    title, article = fetch_article(args.url)
    article_bias = detect_bias(article[:2048])
    article_sentiment = detect_sentiment(article[:512])

    article_obj = {
        "title": title,
        "bias": article_bias,
        "sentiment": article_sentiment,
        "embeddings": embed_text(article)
    }
    print(article_obj)
    
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
    for topic in topics:
        assert len(topic) <= 512
        specific_points.append({
            "excerpt": topic,
            "bias": detect_bias(topic),
            "sentiment": detect_sentiment(topic),
            "embeddings": embed_text(topic)
        })
    print(specific_points)

    
if __name__ == '__main__':
    main()
