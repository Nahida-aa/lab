# Flask

## 项目结构

```sh
FlaskProject/
│
├── app/
│   ├── __init__.py     # 创建 Flask 应用
│   ├── models.py       # 定义数据库模型
│   ├── routes.py       # 定义路由和视图函数
│   ├── config.py       # 配置文件
│   ├── templates/      # 模板文件
│   └── static/         # 静态文件
│
├── run.py              # 项目入口文件
├── wsgi.py             # WSGI 入口文件
├── gunicorn_config.py  # Gunicorn 配置文件
├── requirements.txt
└── readme.md
```

### app/__init__.py

1. 创建 Flask 应用
2. 配置应用程序(如数据库、扩展等)
3. 注册蓝图或路由

### app/routes.py

用于定义应用程序的路由和视图函数。在 Flask 中，路由决定了 URL 与处理函数之间的映射关系

## Miniconda
  
```sh
mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm -rf ~/miniconda3/miniconda.sh

~/miniconda3/bin/conda init bash
~/miniconda3/bin/conda init zsh

source ~/.bashrc
source ~/.zshrc

conda create -n web_py310 python=3.10
conda activate web_py310
```

## API

```sh
# 用于创建api
pip install Flask-RESTful
# 用于创建api文档
pip install flasgger
```

[app/__init__.py](app/__init__.py)

```python
from flask import Flask
from flask_restful import Api
from flasgger import Swagger

def create_app():
    app = Flask(__name__)
    api = Api(app)
    swagger = Swagger(app)

    from .routes import Nahida
    api.add_resource(Nahida, '/')

    return app
```

[app/routes.py](app/routes.py)

```python
from flask import jsonify
from flask_restful import Resource

class Nahida(Resource):
    def get(self):
        """
        A simple GET endpoint
        ---
        responses:
          200:
            description: A successful response
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Hello, World!"
        """
        return jsonify({"message": "Hello, World!"})
```

[run.py](run.py)

```python
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
```

```sh
python run.py
```

```sh
# 访问 http://localhost:5000/apidocs
```

## SQLAlchemy

是一个基于Python实现的ORM框架，用于操作数据库。

```sh
pip install Flask-SQLAlchemy
```

### [app/__init__.py](app/__init__.py)

```python
from flask import Flask
from flask_restful import Api
from flasgger import Swagger
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///articles.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    api = Api(app)
    
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

    from .routes import HelloWorld, ArticleResource
    api.add_resource(HelloWorld, '/')
    api.add_resource(ArticleResource, '/articles')

    with app.app_context():
        db.create_all()

    return app
```

### [app/models.py](app/models.py)

```python
from . import db

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Article {self.title}>'
```

### [app/routes.py](app/routes.py)

```python
from flask import jsonify, request
from flask_restful import Resource
from .models import Article
from . import db

class HelloWorld(Resource):
    def get(self):
        """
        A simple GET endpoint
        ---
        responses:
          200:
            description: A successful response
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Hello, World!"
        """
        return jsonify({"message": "Hello, World!"})

class ArticleResource(Resource):
    def get(self):
        """
        Get all articles
        ---
        responses:
          200:
            description: A list of articles
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  title:
                    type: string
                  content:
                    type: string
        """
        articles = Article.query.all()
        return jsonify([{"id": article.id, "title": article.title, "content": article.content} for article in articles])

    def post(self):
        """
        Create a new article
        ---
        parameters:
          - in: body
            name: body
            schema:
              type: object
              properties:
                title:
                  type: string
                content:
                  type: string
        responses:
          201:
            description: Article created
        """
        data = request.get_json()
        new_article = Article(title=data['title'], content=data['content'])
        db.session.add(new_article)
        db.session.commit()
        return jsonify({"message": "Article created"}), 201
```

## 部署(Gunicorn 和 Nginx )

### WSGI

Web Server Gateway Interface 是 Python 编程语言中用于 Web 应用程序和 Web 服务器之间通信的标准接口。它定义了一种简单而通用的方式，使得不同的 Web 服务器和 Web 应用程序框架可以互操作

1. **标准化接口**: WSGI 提供了一个标准化的接口，使得 Web 服务器和 Web 应用程序可以互相通信，而不需要关心彼此的具体实现细节

2. **灵活性**: 通过 WSGI，开发者可以选择不同的 Web 服务器（如 Gunicorn、uWSGI）来部署他们的应用，而不需要修改应用代码

3. **可扩展性**: WSGI 中间件可以在请求和响应之间插入额外的处理逻辑，如日志记录、认证、压缩等。

[wsgi.py](wsgi.py)

```python
from app import create_app
from app.config import ProductionConfig

app = create_app(ProductionConfig)

if __name__ == "__main__":
    app.run()
```

### Gunicorn

并发

1.**安装依赖**

```sh
pip install gunicorn
```

2.**创建 Gunicorn 配置文件**

[gunicorn_config.py](gunicorn_config.py)

```python
bind = '0.0.0.0:8000'
workers = 3
```

3.**配置防火墙**

```sh
# 确保你的服务器防火墙允许外部访问端口 8000
sudo ufw allow 8000
```

4.**运行 Gunicorn**

```sh
gunicorn -c gunicorn_config.py wsgi:app
# 此时已经可以通过 http://your_domain_or_IP:8000 访问你的 Flask 应用
```

### Nginx

为了更好的性能和安全性，建议使用 Nginx 作为反向代理。以下是一个简单的 Nginx 配置示例

**安装 Nginx**:

```sh
# 更新软件包索引
sudo apt update
# 安装 Nginx
sudo apt install nginx
# 启动 Nginx 服务
sudo systemctl start nginx
# 设置 Nginx 开机自启
sudo systemctl enable nginx
```

**配置 Nginx**:

```sh
sudo vi /etc/nginx/sites-available/flask_app
```

[/etc/nginx/sites-available/flask_app](/etc/nginx/sites-available/flask_app)

```nginx
server {
    listen 80;
    # server_name your_domain_or_IP;
    server_name 175.178.164.97;

    location / {
        proxy_pass http://0.0.0.0:8000; # 确保端口和 Gunicorn 配置一致
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /home/aa/my_flask_app/app/static;
    }
}
```

**启用 Nginx 配置**

```sh
sudo ln -s /etc/nginx/sites-available/flask_app /etc/nginx/sites-enabled
sudo systemctl restart nginx
sudo ufw allow 80
conda activate web_py310
gunicorn -c gunicorn_config.py wsgi:app
# http://your_domain_or_IP/apidocs
```

### todo

待定

8.**使用 Supervisor 管理 Gunicorn**： 安装 Supervisor：

```sh
sudo apt install supervisor
```

创建 Supervisor 配置文件

[/etc/supervisor/conf.d/flask_app.conf](/etc/supervisor/conf.d/flask_app.conf)

```conf
[program:flask_app]
command=/path_to_your_virtualenv/bin/gunicorn -c /path_to_your_project/gunicorn_config.py wsgi:app
directory=/path_to_your_project
user=your_user
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
```

启用并启动 Supervisor 服务

```sh
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start flask_app
```
