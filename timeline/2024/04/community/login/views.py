from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponseRedirect, JsonResponse, Http404
from login.models import (
    LoginUser,
    MyUser,
    Employee, DeptModel
    )
import hashlib

from rest_framework import permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    LoginUserSerializer,
    MyUserSerializer, MyTokenObtainPairSerializer
    )
from .serializers import EmployeeSerializer, DeptModelSerializer, EmployeeSerializer2
from rest_framework.generics import GenericAPIView,ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView

class EmployeeViewSet(viewsets.ModelViewSet):
    """
        create:
        新增员工的接口
        list:
        获取所有员工的接口
        retrieve:
        根据主键，获取单个员工的接口
        update:
        根据主键，更新员工的接口
        partial_update:
        根据主键，局部更新员工的接口
        destroy:
        根据主键，删除员工的接口
    """

    queryset = Employee.objects.all()
    # serializer_class = EmployeeSerializer
    serializer_class = EmployeeSerializer2

class DeptModelViewSet(viewsets.ModelViewSet):
    queryset = DeptModel.objects.all()
    serializer_class = DeptModelSerializer
    permission_classes = [
        # permissions.AllowAny, # 允许任何人
        # permissions.IsAuthenticated, # 登录用户
        # permissions.IsAdminUser, # 管理员
        # permissions.IsAuthenticatedOrReadOnly # 登录用户或只读(未登录也可以访问)
    ]

class ApiDemo1(ListCreateAPIView):
    serializer_class = LoginUserSerializer
    queryset = LoginUser.objects.all()

class ApiDemo2(RetrieveUpdateDestroyAPIView):
    serializer_class = LoginUserSerializer
    queryset = LoginUser.objects.all()
    def delete(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        return Response({"message": '完成删除'}, status=response.status_code)

class UserViewDemoG1(GenericAPIView, ListModelMixin, CreateModelMixin):
    serializer_class = LoginUserSerializer
    queryset = LoginUser.objects.all()

    def get(self, request):
        # query_set = self.get_queryset()
        # # 序列化{obj -> dict{serializer.data}}
        # serializer = self.get_serializer(instance=query_set, many=True)
        # # 返回序列化后的数据 {dict -> json}
        # return Response(serializer.data)
        return self.list(request)
    
    def post(self, request):
        # # 拿到请求数据
        # data = request.data
        # # 反序列化{dict -> obj{serializer.validated_data}}
        # serializer = self.get_serializer(data=data)
        # if serializer.is_valid():
        #     # save()方法会调用create()或update()方法
        #     # 序列化{obj -> dict{serializer.data}}
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return self.create(request)

class UserViewDemoG2(GenericAPIView, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    serializer_class = LoginUserSerializer
    queryset = LoginUser.objects.all()
    # def get_object(self):
    #     pass # 重写这个方法
    
    def get(self, request, pk):
        # # print(pk, type(pk))
        # # 获取单个用户
        # user = self.get_object() # 自动根据pk获取单个对象
        # # 序列化{obj -> dict{serializer.data}}
        # serializer = self.get_serializer(instance=user)
        # # 返回序列化后的数据 {dict -> json}
        # return Response(serializer.data)
        return self.retrieve(request, pk)
    
    def put(self, request, pk):
        # # 获取单个用户
        # user = self.get_object()
        # # 拿到请求数据
        # data = request.data
        # # 反序列化{dict -> obj{serializer.validated_data}}
        # serializer = self.get_serializer(instance=user, data=data)
        # if serializer.is_valid():
        #     # save()方法会调用create()或update()方法
        #     # 序列化{obj -> dict{serializer.data}}
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return self.update(request, pk)
    
    def patch(self, request, pk):
        # # 获取单个用户
        # user = self.get_object()
        # # 拿到请求数据
        # data = request.data
        # # 反序列化{dict -> obj{serializer.validated_data}}
        # serializer = self.get_serializer(instance=user, data=data, partial=True)
        # if serializer.is_valid():
        #     # save()方法会调用create()或update()方法
        #     # 序列化{obj -> dict{serializer.data}}
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return self.partial_update(request, pk)
    
    def destroy(self, request, *args, **kwargs):
        # 继承
        response = super().destroy(request, *args, **kwargs)
        return Response({"message": '完成删除'}, status=response.status_code)
    

    def delete(self, request, pk):
        # # 获取单个用户
        # user = self.get_object()
        # # 删除用户
        # user.delete()
        # return Response({"message": '完成删除'}, status=status.HTTP_204_NO_CONTENT)
        return self.destroy(request, pk)

"""
APIView.as_view() 在View的as_view()方法的基础上, 使用csrf_exempt装饰器的封装
"""
class UserViewDemo1(APIView):
    def get(self, request):
        query_set = LoginUser.objects.all()
        # 序列化{obj -> dict{serializer.data}}
        serializer = LoginUserSerializer(instance=query_set, many=True)
        """
        如果你在创建序列化器实例时设置了 many=True, 那么这个序列化器将期望处理一个对象列表，而不是单个对象
        同样，如果你在反序列化数据（即，将已序列化的数据转换回 Python 数据类型）时设置了 many=True, 那么序列化器将期望处理的是一个字典列表，而不是单个字典
        """
        # 返回序列化后的数据 {dict -> json}
        return Response(serializer.data)
    
    def post(self, request):
        # 拿到请求数据
        data = request.data
        # 反序列化{dict -> obj{serializer.validated_data}}
        serializer = LoginUserSerializer(data=data)
        if serializer.is_valid():
            # save()方法会调用create()或update()方法
            # 序列化{obj -> dict{serializer.data}}
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserViewDemo2(APIView):
    def get_object(self, pk):
        try:
            return LoginUser.objects.get(pk=pk)
        except LoginUser.DoesNotExist:
            print('捕获异常', pk, type(pk))
            return Response({"status": 404}, status=status.HTTP_404_NOT_FOUND)
        
    def get(self, request, pk):
        # print(pk, type(pk))
        # 获取单个用户
        user = self.get_object(pk)
        if isinstance(user, Response):
            return user
        # print(user, type(user))
        # 序列化{obj -> dict{serializer.data}}
        serializer = LoginUserSerializer(instance=user)
        # 返回序列化后的数据 {dict -> json}
        return Response(serializer.data)
    
    def put(self, request, pk):
        # 获取单个用户
        user = self.get_object(pk)
        if isinstance(user, Response):
            return user
        # 拿到请求数据
        data = request.data
        # 反序列化{dict -> obj{serializer.validated_data}}
        serializer = LoginUserSerializer(instance=user, data=data)
        if serializer.is_valid():
            # save()方法会调用create()或update()方法
            # 序列化{obj -> dict{serializer.data}}
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        # 获取单个用户
        user = self.get_object(pk)
        if isinstance(user, Response):
            return user
        # 拿到请求数据
        data = request.data
        # 反序列化{dict -> obj{serializer.validated_data}}
        serializer = LoginUserSerializer(instance=user, data=data, partial=True)
        if serializer.is_valid():
            # save()方法会调用create()或update()方法
            # 序列化{obj -> dict{serializer.data}}
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        # 获取单个用户
        user = self.get_object(pk)
        if isinstance(user, Response):
            return user
        # 删除用户
        user.delete()
        return Response({"message": '完成删除'}, status=status.HTTP_204_NO_CONTENT)

class UserViewSet(viewsets.ModelViewSet):
    """
    GET /users/ 获取所有用户
    GET /users/1/ 获取id=1的用户
    POST /users/ 创建一个新用户并返回该用户
    PUT /users/1/ 更新id=1的用户并返回该用户
    PATCH /users/1/ 局部更新id=1的用户并返回该用户
    DELETE /users/1/ 删除id=1的用户
    """
    # 指定结果集并设置排序
    queryset = MyUser.objects.all()
    # 指定序列化的类
    serializer_class = MyUserSerializer
    # 指定权限类
    # permission_classes = [permissions.IsAuthenticated] # 只有登录用户才能访问

    @action(methods=['get'], detail=False) # detail=False表示不需要传id
    def search(self, request):
        """
        多条件搜索
        """
        # 搜索
        username = request.query_params.get('name', '')
        is_active = request.query_params.get('is_active', 2)
        if username=='' and is_active==2:
            # 如果没有搜索条件，返回所有
            user = MyUser.objects.all()
        elif username!='' and is_active==2:
            # 如果只有用户名
            user = MyUser.objects.filter(username__contains=username)
        elif username=='' and is_active!=2:
            # 如果只有激活状态
            user = MyUser.objects.filter(is_active=is_active)
        else:
            # 如果两个条件都有
            user = MyUser.objects.filter(username__contains=username, is_active=is_active)
        serializer = MyUserSerializer(instance=user, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterAPI(CreateAPIView):
    # queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer

class LoginAPI(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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
    if LoginUser.objects.filter(username=username).exists():
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
        if LoginUser.objects.filter(username=username).exists():
            return JsonResponse({'status': 0, 'msg': '用户名已存在'})
        if len(password) < 2 or len(password) > 40:
            return JsonResponse({'status': 0, 'msg': '密码长度为2-40位'})
        if password != cpassword:
            return JsonResponse({'status': 0, 'msg': '两次密码不一致'})
        
        # 密码加密
        s = hashlib.sha1()
        s.update(password.encode('utf-8'))
        password = s.hexdigest()
        # 保存到数据库
        try: # 例如数据库断电
            user = LoginUser()
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
        user = LoginUser.objects.filter(username=username, is_delete=False).first()
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
        request.session['user_id'] = user.id # ignore
        request.session['username'] = username
        request.session.set_expiry(60*60*24*30) # 一个月
        # return JsonResponse({'status': 1, 'msg': '登录成功', 'url': '../'})
        """
        登录成功后，跳转到首页
        """
        # 登录成功后，跳转到刚才访问的页面
        return JsonResponse({'status': 1, 'msg': '登录成功', 'url': request.GET.get('next', '/')})