from flask import request, send_file, send_from_directory, Blueprint
import os
import shutil
import traceback
from datetime import datetime
from io import BytesIO
from generate_files import init, init_random_files
from werkzeug.utils import safe_join
from celery.contrib.abortable import AbortableAsyncResult
from celery.exceptions import TaskRevokedError

api = Blueprint('api', __name__)

@api.errorhandler(404)
def page_not_found(e):
    return {"message": "Page not found"}, 404

@api.errorhandler(405)
def method_not_allowed(e):
    return {"message": "Method not allowed"}, 405

@api.errorhandler(400)
def bad_request(e):
    return {"message": "Bad request"}, 400

@api.errorhandler(500)
def internal_server_error(e):
    return {"message": "Internal server error"}, 500


@api.route('/generate', methods=["POST"])
def generate():
    content = request.get_json()
    print(request.headers['Content-Type'])

    if content['uniqueId'] is None or content['uniqueId'] == "default":
        return "UniqueId was not provided or incorrect", 400

    unique_id = content['uniqueId']
    words_list = content['words']

    result = init.delay(unique_id, words_list)
    return {"task_id": result.id}, 200

@api.get("/result/<id>")
def task_result(id: str) -> dict[str, object]:
    result = AbortableAsyncResult(id)
    if (result.state == 'FAILURE'):
        return {"message": "internal server error"}, 400
    
    if (result.state == 'SUCCESS'):
        response = {"state": result.state, "processed_files": result.info}
        result.forget();
        return response

    return {
        "ready": result.ready(),
        "successful": result.successful(),
        "state": result.state,
        "state_info": result.info,
        "value": result.result if result.ready() else None,
    }

@api.put("/cancel/<id>")
def task_cancel(id: str):
    task = AbortableAsyncResult(id)
    task.abort()
    return {"message": "successfully revoked"}, 200
    
@api.route('/generate-random', methods=["GET"])
def generate_random():
    try:
        processed_files = init_random_files()
        return {"processed_files": processed_files}, 200
    except Exception:
        print(traceback.format_exc())
        return {"message": "internal server error"}, 500

@api.route('/loops/<unique_id>/<filename>')
def send_loop(unique_id, filename):
    path_prefix = "wavs/processed/loop"
    path_with_id = safe_join(path_prefix, unique_id)
    formatted_filename = f"loop_{filename}"
    if os.path.exists(path_with_id):
        print(path_with_id, formatted_filename)
        return send_from_directory(path_with_id, formatted_filename)
    else:
        print("path does not exist")
    
@api.route('/oneshot/<unique_id>/<filename>')
def send_oneshot(unique_id, filename):
    path_prefix = "wavs/processed/oneshot"
    path_with_id = safe_join(path_prefix, unique_id)
    formatted_filename = f"oneshot_{filename}"
    if os.path.exists(path_with_id):
        print(path_with_id, formatted_filename)
        return send_from_directory(path_with_id, formatted_filename)
    else:
        print("path does not exist")


@api.route('/zip/<unique_id>/<playback_type>')
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