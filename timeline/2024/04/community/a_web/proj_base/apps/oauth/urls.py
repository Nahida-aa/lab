from django.urls import path, re_path
from .views import *

urlpatterns = [
    path('^qq/login_url/$', QQLoginURL.as_view(), name='qq_login_url'),
    path('^github/login_url/$', GithubLoginURL.as_view(), name='github_login_url'),
]