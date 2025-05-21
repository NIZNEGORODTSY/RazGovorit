from transformers import AutoTokenizer
import torch
import os
import joblib

model_name = "IlyaGusev/rut5_base_sum_gazeta"
tokenizer = AutoTokenizer.from_pretrained(model_name)

model_path = os.path.join(os.path.dirname(__file__), "my_model/new_best_model.pkl")
model = joblib.load(model_path)

def postprocess_text(text: str) -> str:
    i = 0
    while not text[i].isalpha():
        i += 1
    text = text[i:]
    return text

def simplify_text(text: str) -> str:
    input_ids = tokenizer(
        [text],
        max_length=600,
        add_special_tokens=True,
        padding="max_length",
        truncation=True,
        return_tensors="pt"
    )["input_ids"]

    output_ids = model.generate(
        input_ids=input_ids,
        no_repeat_ngram_size=4,
        num_beams = 10,
        length_penalty = 0.5,
        max_new_tokens=200,
        min_new_tokens=30,
    )[0]

    summary = tokenizer.decode(output_ids, skip_special_tokens=True)
    return postprocess_text(summary)

#  Ясный текст в разработке
def clearize_text(text: str) -> str:
    input_ids = tokenizer(
        [text],
        max_length=600,
        add_special_tokens=True,
        padding="max_length",
        truncation=True,
        return_tensors="pt"
    )["input_ids"]

    output_ids = model.generate(
        input_ids=input_ids,
        no_repeat_ngram_size=4,
        num_beams = 10,
        length_penalty = 0.5,
        max_new_tokens=200,
        min_new_tokens=30,
    )[0]

    summary = tokenizer.decode(output_ids, skip_special_tokens=True)
    return postprocess_text(summary)