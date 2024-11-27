# dev

项目结构
```yml
api/:
  nj_api/:
    __init__.py
  asgi.py
  settings.py
  urls.py
  wsgi.py
manage.py
```

```sh
pip install django-ninja
# 进入 根应用 (项目目录)
cd api
mkdir nj_api
cd nj_api
touch __init__.py
```

```python name="api/nj_api/__init__.py"
from ninja import NinjaAPI

api = NinjaAPI()


@api.get("/add")
def add(request, a: int, b: int):
    return {"result": a + b}
```

```python name="api/urls.py"
from django.contrib import admin
from django.urls import path, include
from .nj_api import api

urlpatterns = [
    path('admin/', admin.site.urls),
    ...
    path("api/", api.urls),
]
```
