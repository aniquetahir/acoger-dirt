import spacy
import sys
from spacy import displacy
spacy.prefer_gpu()


if __name__ == "__main__":
    string = sys.argv[1]
    nlp = spacy.load("en_core_web_lg")
    d = nlp(string)
    print(displacy.render(d, style='ent'))