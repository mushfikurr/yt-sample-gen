import os
import traceback
import uuid

from flask import (Flask, Response, jsonify, request, send_from_directory,
                   stream_with_context, send_file)
from flask_cors import CORS
from generate_files import init, init_random_files
from werkzeug.utils import safe_join
import shutil
from datetime import datetime
from io import BytesIO
import zipfile


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

        if content['uniqueId'] is None or content['uniqueId'] == "default":
            return "UniqueId was not provided or incorrect", 400

        unique_id = content['uniqueId']
        words_list = content['words']

        processed_files = init(unique_id, words_list)
        if len(processed_files) != 0:
            return {"processed_files": processed_files}, 200
        else:
            return {"message": "Error processing files"}, 500
    
        
    @app.route('/generate-random', methods=["GET"])
    def generate_random():
        try:
            processed_files = init_random_files()
            return {"processed_files": processed_files}, 200
        except Exception:
            print(traceback.format_exc())
            return {"message": "internal server error"}, 500

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
    
    
    @app.route('/zip/<unique_id>/<playback_type>')
    def send_zipped_file(unique_id, playback_type):
        directory_to_zip = os.path.join("wavs", "processed", playback_type, unique_id)
        formatted_date_today = datetime.today().strftime('%d-%m-%Y')

        zip_buffer = BytesIO()
        # TODO: Add zipping for default directories

        with shutil.ZipFile(zip_buffer, 'w') as zip_file:
            for folder_name, subfolders, file_names in os.walk(directory_to_zip):
                for filename in file_names:
                    file_path = os.path.join(folder_name, filename)
                    zip_file.write(file_path, os.path.relpath(file_path, directory_to_zip))

        zip_buffer.seek(0)

        return send_file(zip_buffer, download_name=f'{playback_type}-{formatted_date_today}', as_attachment=True)

    
    return app
