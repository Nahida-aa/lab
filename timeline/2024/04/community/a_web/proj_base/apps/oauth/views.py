from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View
from AgentLogin import AgentLogin
from django.conf import settings
from proj_base.utils import oauth


class QQLoginURL(View):
    def get(self, request):
        qq_login_url = AgentLogin.qq_url(settings.QQ_CLIENT_ID, settings.QQ_REDIRECT_URI)
        return JsonResponse({'qq_login_url': qq_login_url, 'code': 200, 'msg': 'ok'})

class GithubLoginURL(View):
    def get(self, request):
        github_login_url = oauth.github_login_url(settings.GITHUB_CLIENT_ID, settings.GITHUB_REDIRECT_URI)
        return JsonResponse({'github_login_url': github_login_url, 'code': 200, 'msg': 'ok'})