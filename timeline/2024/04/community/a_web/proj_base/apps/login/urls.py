from django.urls import path, re_path
from .views import *
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

# router = routers.DefaultRouter()
# 用来处理视图集的路由器
router = routers.SimpleRouter() 

# 注册视图集
router.register(r'users', UserViewSet)
router.register(r'emp', EmployeeViewSet)
router.register(r'dept', DeptModelViewSet)

# 将request的url映射到视图函数
urlpatterns = [
    # path('reg/', Register.as_view(), name='reg'),
    path("register/", Register.as_view(), name="register"), # 注册
    path("register_test/", RegisterTest.as_view(), name="register_test"), # 注册测试
    path("register_mg/", RegisterMg.as_view(), name="register_mg"), # 注册测试
    path('reg_api', RegisterAPI.as_view(), name='reg_api'),

    path('login_test/', LoginTest.as_view(), name='login_test'),
    path('login_api/', TokenObtainPairView.as_view(), name='login_api'),

    # path('check_username/', check_username, name='check_username'),
    re_path(r'^usernames/(?P<username>.{1,40})/count/$', UsernameCount.as_view(), name='username_count'),
    # path('logout/', logout, name='logout'),
    path('logout_test/', LogoutTest.as_view(), name='logout_test'),
    # path('api_view_demo/', UserViewDemo1.as_view()),
    # path('api_view_demo/<int:pk>/', UserViewDemo2.as_view()),
    # path('api_view_demog/', UserViewDemoG1.as_view()),  
    # path('api_view_demog/<int:pk>/', UserViewDemoG2.as_view()),
]

urlpatterns += router.urls

# urlpatterns = format_suffix_patterns(urlpatterns)
"""
format_suffix_patterns 是 Django REST Framework 提供的一个函数，它可以为你的 URL 模式添加格式后缀。格式后缀允许客户端指定响应的数据格式。

例如，如果你有一个 URL 模式 /api/items/，使用 format_suffix_patterns 后，客户端可以通过 /api/items.json 获取 JSON 格式的数据，或通过 /api/items.api 获取 API 格式的数据
"""