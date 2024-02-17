import argparse
import requests
from openai import OpenAI
import os

BIAS_URL = "https://api-inference.huggingface.co/models/d4data/bias-detection-model"
SENTIMENT_URL = "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis"
API_TOKEN = "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"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

client = OpenAI(
    api_key="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",
)


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
	response = requests.post(BIAS_URL, headers=headers, json={
        "inputs": input
    })
	return response.json()

def detect_sentiment(input):
	response = requests.post(SENTIMENT_URL, headers=headers, json={
        "inputs": input
    })
	return response.json()

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
        "sentiment": article_sentiment
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
            "sentiment": detect_sentiment(topic)
        })
    print(specific_points)

    
if __name__ == '__main__':
    main()
