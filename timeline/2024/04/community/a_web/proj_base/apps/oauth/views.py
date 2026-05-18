from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.views.generic import View
# from AgentLogin import AgentLogin
from django.conf import settings
from proj_base.utils.oauth import get_github_login_url, get_github_info
from userapp.models import MyUser
import uuid
from django.contrib.auth import login
from .models import GithubAuth


# class QQLoginURL(View):
#     def get(self, request):
#         qq_login_url = AgentLogin.qq_url(settings.QQ_CLIENT_ID, settings.QQ_REDIRECT_URI)
#         return JsonResponse({'qq_login_url': qq_login_url, 'code': 200, 'msg': 'ok'})

# class QQUserInfo(View):
#     def get(self, request):
#         code = request.GET.get('code')
#         access_token = AgentLogin.qq_access_token(settings.QQ_CLIENT_ID, settings.QQ_CLIENT_SECRET, code, settings.QQ_REDIRECT_URI)
#         openid = AgentLogin.qq_openid(access_token)
#         user_info = AgentLogin.qq_user_info(access_token, openid)
#         return JsonResponse({'user_info': user_info, 'code': 200, 'msg': 'ok'})

class GithubLoginURL(View):
    def get(self, request):
        github_login_url = get_github_login_url(settings.GITHUB_CLIENT_ID, settings.GITHUB_REDIRECT_URI)
        print(f'github_login_url: \n{github_login_url}')
        return JsonResponse({'github_login_url': github_login_url, 'code': 200, 'msg': 'ok'})
    
class GithubLoginAuth(View):
    def get(self, request):
        """
        登录或注册
        并获得用户信息
        """
        code = request.GET.get('code')
        print(f'code: \n{code}')
        user_info = get_github_info(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET, code, settings.GITHUB_REDIRECT_URI)
        github_username = user_info["login"]
        oauth_github_id = user_info["id"]
        github_url = user_info["html_url"]
        # 判断用户是否第一次登录，如果是第一次登录，等效于注册
        try:
            user = MyUser.objects.filter(oauth_github_id=oauth_github_id).first()
            # 注册
            if not user:
                # 检查用户名是否已经被使用
                if MyUser.objects.filter(username=github_username).exists():
                    # 如果用户名已经被使用，添加额外的字符或数字来创建一个唯一的用户名
                    github_username += str(uuid.uuid4())
                user = MyUser.objects.create(username=github_username, oauth_github_id=oauth_github_id)
                GithubAuth.objects.create(user=user, github_username=github_username, oauth_github_id=oauth_github_id, github_url=github_url)
                login(request, user)
            # 登录
            else:
                # 当一个已经注册的用户再次通过 GitHub 登录时，
                # 他们的 GitHub 用户名、用户 ID 或个人主页 URL 可能已经改变
                github_auth = GithubAuth.objects.get(user=user)
                github_auth.github_username = github_username
                github_auth.oauth_github_id = oauth_github_id
                github_auth.github_url = github_url
                github_auth.save()
                # 不更新用户名，给用户设置登录状态
                login(request, user)
        except Exception as e:
            return JsonResponse({'code': 500, 'msg': e})
        # # 登录成功重定向到首页
        # return redirect('/')
        # 登录成功，返回 github_auth_result.html 页面
        return render(request, 'oauth/github_auth_result.html')
        # return JsonResponse({'user_info': user_info, 'code': 200, 'msg': 'ok'})