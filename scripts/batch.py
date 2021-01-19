from get_posts import get_data as get_posts
from get_reply import get_replies
from emotion import get_emotion
import typing
import json
from sentiment import get_sentiment
from pyspark import SparkContext, SparkConf
from pyspark.sql import SparkSession, UDFRegistration
import pyspark
from pyspark.sql.types import StringType
import pandas as pd
from entities import get_entity_html

def store_emotions(ss: SparkSession):
    posts, postsDF = get_posts()

    sposts = ss.createDataFrame(postsDF)
    sposts.createOrReplaceTempView('sposts')

    ss.udf.register('get_emotion', get_emotion, StringType())

    df_post_emotions = ss.sql('select *, get_emotion(source) as emotion from sposts')

    df_replies = pd.DataFrame(columns=['pid', 'reply'])
    for p in posts:
        pid = p['id']
        ptext = p['source']
        replies = get_replies(pid)
        for r in replies:
            df_replies = df_replies.append({'pid': pid, 'reply': r}, ignore_index=True)
    sreply = ss.createDataFrame(df_replies)
    sreply.createOrReplaceTempView('sreplies')
    df_reply_emotions = ss.sql('select *, get_emotion(reply) as emotion from sreplies')

    df_post_emotions.coalesce(1).toPandas().to_pickle('post_emotions.pkl')
    df_reply_emotions.coalesce(1).toPandas().to_pickle('reply_emotions.pkl')
    pass

def store_sentiments(ss: SparkSession):
    posts, postsDF = get_posts()

    sposts = ss.createDataFrame(postsDF)
    sposts.createOrReplaceTempView('sposts')

    ss.udf.register('get_sentiment', get_sentiment, StringType())

    df_post_emotions = ss.sql('select *, get_sentiment(source) as emotion from sposts')

    df_replies = pd.DataFrame(columns=['pid', 'reply'])
    for p in posts:
        pid = p['id']
        ptext = p['source']
        replies = get_replies(pid)
        for r in replies:
            df_replies = df_replies.append({'pid': pid, 'reply': r}, ignore_index=True)
    sreply = ss.createDataFrame(df_replies)
    sreply.createOrReplaceTempView('sreplies')
    df_reply_emotions = ss.sql('select *, get_sentiment(reply) as emotion from sreplies')

    df_post_emotions.coalesce(1).toPandas().to_pickle('post_sentiments.pkl')
    df_reply_emotions.coalesce(1).toPandas().to_pickle('reply_sentiments.pkl')


def store_entities(ss: SparkSession):

    posts, postsDF = get_posts()

    sposts = ss.createDataFrame(postsDF)
    sposts.createOrReplaceTempView('sposts')

    ss.udf.register('get_entities', get_entity_html, StringType())

    df_post_emotions = ss.sql('select *, get_entities(source) as entities from sposts')

    df_post_emotions.coalesce(1).toPandas().to_pickle('post_entities.pkl')

if __name__ == '__main__':
    sc = SparkContext.getOrCreate(SparkConf().setMaster('local[*]'))
    ss = SparkSession.builder.getOrCreate()

    # store_emotions(ss)
    # store_sentiments(ss)
    store_entities(ss)

    pass