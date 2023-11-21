import os

from flask import Flask
from generate_files import init
from flask import jsonify
from flask_cors import CORS
import uuid

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='dev')
    CORS(app);

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass



    @app.route('/generate')
    def generate():
        unique_id = str(uuid.uuid4())
        processed_files = init(unique_id);
        return jsonify({"processed_files": processed_files, "id": unique_id})
    

    return app