import logging
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask_restful import Api
from flasgger import Swagger
from flask_sqlalchemy import SQLAlchemy
from .config import DevelopmentConfig, ProductionConfig

db = SQLAlchemy()

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    
    api = Api(app)
    
    # log
    if not app.debug:
        formatter = logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        )
        log_handler = RotatingFileHandler("logs/flask_app.log", maxBytes=10240, backupCount=10)
        log_handler.setLevel(logging.INFO)
        log_handler.setFormatter(formatter)
        app.logger.addHandler(log_handler)
        app.logger.info('Flask startup')
    
    # 自定义 Swagger 配置
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec_1',
                "route": '/apispec_1.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/",
        "swagger_ui_bundle_js": "//unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js",
        "swagger_ui_standalone_preset_js": "//unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js",
        "swagger_ui_css": "//unpkg.com/swagger-ui-dist@3/swagger-ui.css",
        "lang": "zh-cn"  # 默认语言设置为中文
    }

    swagger = Swagger(app, config=swagger_config)

    from .routes import Nahida, ArticleResource
    api.add_resource(Nahida, '/')
    api.add_resource(ArticleResource, '/articles')

    with app.app_context():
        db.create_all()

    return app