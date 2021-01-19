from silmarillion import get_t5_similarity
from get_posts import get_data as get_posts
from get_reply import get_replies
import random

BATCH_SIZE = 128

if __name__ == '__main__':
    posts, _ = get_posts()
    similarity_matrix = {}

    for i, p1 in enumerate(posts):
        for j, p2 in enumerate(posts):
            if i == j or (i, j) in similarity_matrix.keys():
                continue
            similarity_matrix[(i, j)] = (p1['source'], p2['source'])
            similarity_matrix[(j, i)] = similarity_matrix[(i, j)]

    sentence_tuples = list(set(similarity_matrix.values()))
    random.shuffle(sentence_tuples)

    num_iterations = len(sentence_tuples) // BATCH_SIZE
    similarities = []
    for i in range(num_iterations):
        start = i * BATCH_SIZE
        end = (i+1) * BATCH_SIZE
        batch = sentence_tuples[start:end]
        t_simil = get_t5_similarity(batch)
        for t in t_simil:
            similarities.append(t)


    for i, s in enumerate(sentence_tuples):
        print(s)
        print(similarities[i])

    pass