from transformers import AutoTokenizer, AutoModelWithLMHead
import json
import sys
import pandas as pd

CACHE = True

def get_emotion_cache(text):
    table = pd.read_pickle('post_emotions.pkl')
    filtered = table[table['source'] == text]
    return filtered['emotion'].values[0]


def get_emotion(text) -> str:
    tokenizer = AutoTokenizer.from_pretrained("mrm8488/t5-base-finetuned-emotion")
    model = AutoModelWithLMHead.from_pretrained("mrm8488/t5-base-finetuned-emotion")
    input_ids = tokenizer.encode(text + '</s>', return_tensors='pt')

    output = model.generate(input_ids=input_ids,
                            max_length=2)

    dec = [tokenizer.decode(ids) for ids in output]
    label = dec[0]
    return label


if __name__ == "__main__":
    context = sys.argv[1]
    print(json.dumps({'T5': get_emotion_cache(context) if CACHE else get_emotion(context)}))