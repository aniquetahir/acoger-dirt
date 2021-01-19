import sys
from transformers import pipeline
import json
import pandas as pd


CACHE = True

def get_sentiment_cache(text):
    table = pd.read_pickle('post_sentiments.pkl')
    filtered = table[table['source'] == text]
    return filtered['emotion'].values[0]

def get_sentiment(text: str):
    classifier = pipeline('sentiment-analysis')
    return json.dumps(classifier(text[:500])[0])

if __name__ == "__main__":
    t = sys.argv[1]
    results = get_sentiment_cache(t) if CACHE else get_sentiment(t)
    print(results)
