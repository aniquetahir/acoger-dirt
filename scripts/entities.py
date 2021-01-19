import spacy
import sys
from spacy import displacy
spacy.prefer_gpu()
import pandas as pd
CACHE = True
NLP = None
def get_spacy_magic_for(lang):
  global NLP
  if NLP is None:
      NLP = {}
  if lang not in NLP:
      NLP[lang] = spacy.load(lang)
  return NLP[lang]

def get_entity_html_cache(text):
    table = pd.read_pickle('post_entities.pkl')
    filtered = table[table['source'] == text]
    return filtered['entities'].values[0]

def get_entity_html(text):
    nlp = get_spacy_magic_for('en_core_web_lg')
    d = nlp(text)
    return displacy.render(d, style='ent')

if __name__ == "__main__":
    string = sys.argv[1]
    print(get_entity_html_cache(string) if CACHE else get_entity_html(string))