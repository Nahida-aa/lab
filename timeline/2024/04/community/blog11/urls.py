"""
URL configuration for blog11 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("ckeditor/", include("ckeditor_uploader.urls")),
    path('login/', include('login.urls')),
    path('api/', include('login.urls')),
    # path('api/', include('rest_framework.urls', namespace='rest_framework')),
    path("", include("my_app.urls")),
]

# urlpatterns += [
#     path("ckeditor5/", include('django_ckeditor_5.urls'), name="ck_editor_5_upload_file"),
# ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
"""
static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 是在开发环境中添加了一个用于服务媒体文件的 URL 路径。这个函数将 URL 路径 settings.MEDIA_URL 映射到文件系统的 settings.MEDIA_ROOT 目录。这意味着当用户访问 settings.MEDIA_URL 路径时，Django 将会在 settings.MEDIA_ROOT 目录中查找并返回请求的文件。

请注意, static() 函数只应在开发环境中使用。在生产环境中，你应该配置你的 web 服务器来服务静态文件和媒体文件。
"""
