from django.shortcuts import render

from django.views.generic import View
from django.http import HttpResponseRedirect, JsonResponse
from login.models import User
import hashlib



# 退出登录 switch_user
def logout(request):
    if 'user_id' in request.session:
        del request.session['user_id']
        del request.session['username']
        # return JsonResponse({'status': 1, 'msg': '退出成功', 'url': '/'})
    return HttpResponseRedirect('/')
    # return JsonResponse({'status': 0, 'msg': '退出失败', 'url': '/'})

def check_username(request):
    username = request.POST.get('username')
    if not username:
        return JsonResponse({'status': 0, 'msg': '用户名不能为空'})
    if len(username) > 16:
        return JsonResponse({'status': 0, 'msg': '用户名长度不能超过16位'})
    if User.objects.filter(username=username).exists():
        print('用户名已存在')
        return JsonResponse({'status': 0, 'msg': '用户名已存在'})
    return JsonResponse({'status': 1, 'msg': '用户名可用'})

class Register(View):
    def get(self, request):
        return render(request, 'login/reg.html')
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        cpassword = request.POST.get('cpassword')
        if not all([username, password, cpassword]):
            return JsonResponse({'status': 0, 'msg': '请填写完整信息'})
        # if username.isdigit():
        #     return JsonResponse({'status': 0, 'msg': '用户名不能为纯数字'})
        if len(username) > 16:
            return JsonResponse({'status': 0, 'msg': '用户名长度不能超过16位'})
        # 判断用户名是否存在
        if User.objects.filter(username=username).exists():
            return JsonResponse({'status': 0, 'msg': '用户名已存在'})
        if len(password) < 2 or len(password) > 40:
            return JsonResponse({'status': 0, 'msg': '密码长度为4-16位'})
        if password != cpassword:
            return JsonResponse({'status': 0, 'msg': '两次密码不一致'})
        
        # 密码加密
        s = hashlib.sha1()
        s.update(password.encode('utf-8'))
        password = s.hexdigest()
        # 保存到数据库
        try: # 例如数据库断电
            user = User()
            user.username = username
            user.password = password
            user.save()
            return JsonResponse({'status': 1, 'msg': '注册成功'})
        except Exception as e:
            return JsonResponse({'status': 0, 'msg': '注册失败'})
        

class Login(View):
    def get(self, request):
        return render(request, 'login/login.html')
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        # 用户是否存在
        user = User.objects.filter(username=username, is_delete=False).first()
        if not user:
            return JsonResponse({'status': 0, 'msg': '账号或密码错误'})
        # 密码是否正确
        s = hashlib.sha1()
        s.update(password.encode('utf-8'))
        password = s.hexdigest()
        if user.password != password:
            return JsonResponse({'status': 0, 'msg': '账号或密码错误'})
        # 登录成功
        # request.session.flush() # 清除session
        """
        """
        request.session['user_id'] = user.id
        request.session['username'] = username
        request.session.set_expiry(60*60*24*30) # 一个月
        # return JsonResponse({'status': 1, 'msg': '登录成功', 'url': '../'})
        """
        登录成功后，跳转到首页
        """
        # 登录成功后，跳转到刚才访问的页面
        return JsonResponse({'status': 1, 'msg': '登录成功', 'url': request.GET.get('next', '/')})