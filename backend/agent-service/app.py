from flask import Flask
import os.path

app = Flask(__name__)

@app.route("/execute", methods=['POST'])
def execute():
    return {'status': 'success'}