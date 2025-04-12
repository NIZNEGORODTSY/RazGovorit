from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import os

# Загрузка модели и токенизатора
model_path = "C:/Users/Kirill/Desktop/techno25/TECHNOSTRELKA_FINAL_2025/backend/my_model"

t = os.path.exists(model_path)

tokenizer = T5Tokenizer.from_pretrained(
    model_path,
    tokenizer_file=model_path+"/spiece.model"
)

model = T5ForConditionalGeneration.from_pretrained(
    model_path,
    torch_dtype=torch.float32,
    device_map="cpu",
    use_safetensors=True
)

def postprocess_text(text: str) -> str:
    i = 0
    while not text[i].isalpha():
        i += 1
    text = text[i:]
    return text

def simplify_text(text: str) -> str:

    inputs = tokenizer("summarize, simplify and keep the main meaning |" + text, return_tensors="pt", max_length=512, truncation=True).to("cpu")

    # outputs = model.generate(inputs["input_ids"], max_length=150, min_length=50, length_penalty=2.0, num_beams=5, early_stopping=True)
    
    outputs = model.generate(
        inputs.input_ids,
        max_length=250,
        min_length=100,
        num_beams=4,
        early_stopping=True
    )

    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return postprocess_text(summary)

def clearize_text(text: str) -> str:
    inputs = tokenizer("summarize, simplify and keep the main meaning |" + text, return_tensors="pt", max_length=512, truncation=True).to("cpu")
    
    outputs = model.generate(
        inputs.inputs_ids,
        max_length=250,
        min_length=100,
        num_beams=4,
        early_stopping=True
    )

    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return postprocess_text(summary)