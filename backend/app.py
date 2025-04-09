from flask import Flask, request, jsonify
import modelapi

app = Flask("ServerModel")


@app.route("/simplify", methods=["POST"])
def simplify():
    data = request.json
    text = data.get("text")
    return jsonify({
        "result": modelapi.simplify_text(text)
    })


app.run(debug=False, host="0.0.0.0", port=5000)
