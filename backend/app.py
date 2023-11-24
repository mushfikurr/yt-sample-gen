import os
import uuid

from flask import Flask, Response, jsonify, request, stream_with_context, send_from_directory
from werkzeug.utils import safe_join
from flask_cors import CORS
from generate_files import init


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

    @app.errorhandler(404)
    def page_not_found(e):
        return {"message": "Page not found"}, 404
    
    @app.errorhandler(405)
    def method_not_allowed(e):
        return {"message": "Method not allowed"}, 405
    
    @app.errorhandler(400)
    def bad_request(e):
        return {"message": "Bad request"}, 400
    
    @app.errorhandler(500)
    def internal_server_error(e):
        return {"message": "Internal server error"}, 500


    @app.route('/generate', methods=["POST"])
    def generate():
        content = request.get_json()
        print(request.headers['Content-Type'])

        if content['uniqueId'] is None:
            return "UniqueId was not provided", 400

        unique_id = content['uniqueId']
        processed_files = init(unique_id)
        if len(processed_files) != 0:
            return {"processed_files": processed_files}, 200
        else:
            return {"message": "Error processing files"}, 500

    @app.route('/loops/<unique_id>/<filename>')
    def send_loop(unique_id, filename):
        path_prefix = "wavs/processed/loop"
        path_with_id = safe_join(path_prefix, unique_id)
        formatted_filename = f"loop_{filename}"
        if os.path.exists(path_with_id):
            print(path_with_id, formatted_filename)
            return send_from_directory(path_with_id, formatted_filename)
        else:
            print("path does not exist")
        
    @app.route('/oneshot/<unique_id>/<filename>')
    def send_oneshot(unique_id, filename):
        path_prefix = "wavs/processed/oneshot"
        path_with_id = safe_join(path_prefix, unique_id)
        formatted_filename = f"oneshot_{filename}"
        if os.path.exists(path_with_id):
            print(path_with_id, formatted_filename)
            return send_from_directory(path_with_id, formatted_filename)
        else:
            print("path does not exist")

    return app