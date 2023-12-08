import os

from flask import Flask
from flask_cors import CORS

from init_celery import celery_init_app
from config import CELERY_BROKER_URL, CELERY_RESULT_BACKEND

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='dev')
    CORS(app);
    # cant use .env files for celery.. use constants defined in a python file instead
    app.config.from_mapping(
        CELERY=dict(
            broker_url=CELERY_BROKER_URL, 
            result_backend=CELERY_RESULT_BACKEND,
            task_ignore_result=True,
        ),
    )
    app.config.from_prefixed_env()
    celery_init_app(app)

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from routes import api
    app.register_blueprint(api)
    
    return app
