# from transformers import T5ForConditionalGeneration, T5Tokenizer, AutoTokenizer
from transformers import AutoTokenizer
import torch
import os
import joblib

model_name = "IlyaGusev/rut5_base_sum_gazeta"
tokenizer = AutoTokenizer.from_pretrained(model_name)

model_path = os.path.join(os.path.dirname(__file__), "my_model/cpu_model.pkl")
model = joblib.load(model_path)
# model = model.to('cpu')

# model = torch.load(model_path, map_location=torch.device("cpu"))

# Загрузка модели и токенизатора (старая модель)

# model_path = os.path.join(os.path.dirname(__file__), "my_model/")

# t = os.path.exists(model_path)

# tokenizer = T5Tokenizer.from_pretrained(
#     model_path,
#     tokenizer_file=os.path.join(model_path, "/spiece.model")
# )

# model = T5ForConditionalGeneration.from_pretrained(
#     model_path,
#     torch_dtype=torch.float32,
#     device_map="cpu",
#     use_safetensors=True
# )

def postprocess_text(text: str) -> str:
    i = 0
    while not text[i].isalpha():
        i += 1
    text = text[i:]
    return text

def simplify_text(text: str) -> str:

    # inputs = tokenizer("summarize, simplify and keep the main meaning |" + text, return_tensors="pt", max_length=512, truncation=True).to("cpu")

    # # outputs = model.generate(inputs["input_ids"], max_length=150, min_length=50, length_penalty=2.0, num_beams=5, early_stopping=True)
    
    # outputs = model.generate(
    #     inputs.input_ids,
    #     max_length=1000,
    #     min_length=10,
    #     num_beams=4,
    #     early_stopping=True
    # )

    # summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    input_ids = tokenizer(
        ["Упрости и перефразируй текст и сохрани основное значение текста: " + text],
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

def clearize_text(text: str) -> str:
    # inputs = tokenizer("summarize, simplify and keep the main meaning |" + text, return_tensors="pt", max_length=512, truncation=True).to("cpu")
    
    # outputs = model.generate(
    #     inputs.inputs_ids,
    #     max_length=250,
    #     min_length=100,
    #     num_beams=4,
    #     early_stopping=True
    # )

    # summary = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Временно для ясного текста используется тот же запрос
    input_ids = tokenizer(
        ["Упрости и перефразируй текст и сохрани основное значение текста: " + text],
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