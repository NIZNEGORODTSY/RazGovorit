from transformers import T5ForConditionalGeneration, T5Tokenizer

# Загрузка модели и токенизатора
model_name = "t5-small"
tokenizer = T5Tokenizer.from_pretrained(model_name, legacy=False)
model = T5ForConditionalGeneration.from_pretrained(model_name, device_map="cpu")


def postprocess_text(text: str) -> str:
    i = 0
    while not text[i].isalpha():
        i += 1
    text = text[i:]
    return text


def simplify_text(text: str) -> str:
    # text = "NASA's Perseverance rover has discovered organic molecules in Martian rock samples, suggesting the planet may have once hosted conditions suitable for life. The findings, published in Science, are based on data collected in Jezero Crater, an ancient lakebed. While not direct evidence of life, these compounds indicate complex chemical processes occurred on Mars billions of years ago."

    # Токенизация и суммаризация
    inputs = tokenizer("make a summary |" + text, return_tensors="pt", max_length=512, truncation=True)

    summary_ids = model.generate(inputs["input_ids"], max_length=150, min_length=50, length_penalty=2.0, num_beams=5,
                                 early_stopping=True)
    # Декодирование и вывод результата
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return postprocess_text(summary)


