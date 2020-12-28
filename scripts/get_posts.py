import pandas as pd
import json
import os
# from tqdm import tqdm

if __name__ == "__main__":
    train_frame = pd.DataFrame(columns=['id', 'cat', 'source', 'status', 'platform'])
    train_array = []

    BASE_PATH = './datasets/rumoureval2019/rumoureval-2019-training-data'
    with open(os.path.join(BASE_PATH, 'train-key.json')) as key_file:
        train_key = json.load(key_file)

    social_media_map = {
        'twitter': os.path.join(BASE_PATH, 'twitter-english'),
        'reddit': os.path.join(BASE_PATH, 'reddit-training-data')
    }

    for platform, path in list(social_media_map.items())[:1]:
        categories = os.listdir(path)
        for cat in categories:
            tweet_ids = os.listdir(os.path.join(path, cat))
            for tid in tweet_ids:
                try:
                    with open(os.path.join(path, cat, tid, 'source-tweet', f'{tid}.json')) as source_file:
                        source = json.load(source_file)['text']
                    status = train_key['subtaskbenglish'][tid]
                    d = {'id': tid, 'cat': cat, 'source': source, 'status': status, 'platform': platform}
                    train_frame = train_frame.append(d, ignore_index=True)
                    train_array.append(d)
                except Exception as e:
                    # print(e)
                    pass

    for platform, path in list(social_media_map.items())[1:]:
        tweet_ids = os.listdir(path)
        for tid in tweet_ids:
            try:
                with open(os.path.join(path, tid, 'source-tweet', f'{tid}.json')) as source_file:
                    source = json.load(source_file)['data']['children'][0]['data']['title']
                status = train_key['subtaskbenglish'][tid]
                d = {'id': tid, 'cat': cat, 'source': source, 'status': status, 'platform': platform}
                train_frame = train_frame.append(d, ignore_index=True)
                train_array.append(d)
            except Exception as e:
                print(e)
                pass

    print(json.dumps(train_array))