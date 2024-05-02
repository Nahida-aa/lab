from django.urls import path, re_path
from .views import *

urlpatterns = [
    path('qq/login_url/', QQLoginURL.as_view(), name='qq_login_url'),
    path('qq/user_info/', QQUserInfo.as_view(), name='qq_user_info'),
    path('github/login_url/', GithubLoginURL.as_view(), name='github_login_url'),
    path('github/login_auth/', GithubLoginAuth.as_view(), name='github_user_auth'),
]