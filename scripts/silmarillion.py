from transformers import TFAutoModelWithLMHead, AutoTokenizer,\
    AutoModelWithLMHead, T5Tokenizer, T5PreTrainedModel, TFT5ForConditionalGeneration,\
    BatchEncoding
import sys
import json
import typing
tokenizer = AutoTokenizer.from_pretrained('t5-base')
model = TFT5ForConditionalGeneration.from_pretrained('t5-base')

def get_t5_similarity(sentences:typing.List[typing.Tuple]) -> float:
    inputs = [f'stsb sentence1: {sentence1} sentence2: {sentence2}' for sentence1, sentence2 in sentences]
    inp = tokenizer.batch_encode_plus(inputs, padding=True, truncation=True, return_tensors='tf')
    output = model.generate(input_ids=inp['input_ids'], max_length=5)
    dec = [tokenizer.decode(ids) for ids in output]
    score_array = []
    for d in dec:
        try:
            score_array.append(float(d))
        except:
            score_array.append(0)

    return score_array


if __name__ == "__main__":
    sentence1 = sys.argv[1]
    sentence2 = sys.argv[2]
    print(json.dumps({'similarity': get_t5_similarity([(sentence1, sentence2)])[0]}))

