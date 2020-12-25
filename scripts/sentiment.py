import sys
from transformers import pipeline
import json

if __name__ == "__main__":
    t = sys.argv[1]
    classifier = pipeline('sentiment-analysis')
    results = classifier(t)[0]
    print(json.dumps(results))
