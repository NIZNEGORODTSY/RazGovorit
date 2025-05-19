from flask import Flask, request, jsonify, send_file
import modelapi
from werkzeug.utils import secure_filename
from docx import Document
import os

# Директория для всяких временных файлов
if not os.path.exists("temp_files"):
    os.makedirs("temp_files")

app = Flask("ServerModel")

app.config["UPLOAD_FOLDER"] = "temp_files"

ALLOWED_EXTENSIONS = [
    "docx"
]

def allowed_file(filename: str):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/simplify", methods=["POST"])
def simplify():
    data = request.json
    text = data.get("text")
    return jsonify({
        "result": modelapi.simplify_text(text)
    })


@app.route("/test", methods=["POST"])
def test():
    return jsonify({
        "result": "testresult"
    })


@app.route("/clearize", methods=["POST"])
def clearize():
    data = request.json
    text = data.get("text")
    return jsonify({
        "result": modelapi.clear_text(text)
    })


@app.route("/processFile", methods=["POST"])
def process_file():
    if "docxFile" not in request.files:
        return jsonify({ "error": "No file part" }), 400
    
    file = request.files["docxFile"]

    if file.filename == "":
        return jsonify({ "error": "No selected file" }), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        file.save(filepath)

        try:
            doc = Document(filepath)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            text_res = modelapi.simplify_text(text)

            # TODO сохранить ответ (text_res) в виде файла .txt и отправить его обратно
            with open(os.path.join(app.config["UPLOAD_FOLDER"], "processed_" + filename + ".txt"), "w") as fd:
                fd.write(text_res)
            
            return send_file(
                os.path.join(app.config["UPLOAD_FOLDER"], "processed_" + filename + ".txt"),
                as_attachment=True
            )

        except Exception as e:
            print(e)
            return jsonify({ "error": f"Error processing file: {str(e)}" }), 500
    else:
        return jsonify({ 'error': 'Filetype is not allowed' }), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
else:
    app.run(debug=False, host="0.0.0.0", port=5000)
