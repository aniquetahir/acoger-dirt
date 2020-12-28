import json
import sys, os
from transformers import pipeline

if __name__ == "__main__":
    m_id = sys.argv[1]

    BASE_PATH = './datasets/rumoureval2019/rumoureval-2019-training-data'
    with open(os.path.join(BASE_PATH, 'train-key.json')) as key_file:
        train_key = json.load(key_file)

    social_media_map = {
        'twitter': os.path.join(BASE_PATH, 'twitter-english'),
        'reddit': os.path.join(BASE_PATH, 'reddit-training-data')
    }

    post_dirs = [os.path.join(social_media_map['twitter'], cat) for cat in os.listdir(social_media_map['twitter'])]
    post_dirs.append(social_media_map['reddit'])

    post_dirs = [os.path.join(x, y) for x in post_dirs for y in os.listdir(x)]

    # get dir matching the search
    search_dir = [x for x in post_dirs if x.split('/')[-1] == m_id]

    search_dir = os.path.join(search_dir[0], 'replies')
    reply_files = [os.path.join(search_dir, x) for x in os.listdir(search_dir)]

    replies = []
    # Get the content of the replies
    for rl in reply_files:
        # read file
        with open(rl, 'r') as rf:
            reply_obj = json.load(rf)

        if 'text' in reply_obj.keys():
            replies.append(reply_obj['text'])
        else:
            replies.append(reply_obj['data']['body'])
 
    if len(replies) > 0:
        s = pipeline('sentiment-analysis')
        sents = s(replies)
        replies = list(zip(replies, sents))

    replies = [{'text': x[0], 'sentiment': x[1]} for x in replies]

    print(json.dumps(replies))
