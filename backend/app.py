import os

from flask import Flask
from flask_cors import CORS

from init_celery import celery_init_app

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='dev')
    CORS(app);
    app.config.from_mapping(
        CELERY=dict(
            broker_url="redis://:KDUu6X2KIiSsJ60zk34dGB5M6iZQqcOW@redis-12128.c1.eu-west-1-3.ec2.cloud.redislabs.com:12128/0",
            result_backend="redis://:KDUu6X2KIiSsJ60zk34dGB5M6iZQqcOW@redis-12128.c1.eu-west-1-3.ec2.cloud.redislabs.com:12128/0",
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
