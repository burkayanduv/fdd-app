from flask import Flask, request, jsonify
import os

from fdd_main import refload_fdd


# init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))


@app.route("/api", methods=["post"])
def refload_predict():
    data = request.json
    response = refload_fdd(data, basedir)
    return(jsonify({'preds': response.tolist()}), 200)


# run server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
