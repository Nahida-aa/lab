from django.urls import path
from .views import *
from rest_framework import routers

# router = routers.DefaultRouter()
# 用来处理视图集的路由器
router = routers.SimpleRouter() 

# 注册视图集
router.register(r'users', UserViewSet)

urlpatterns = [
    path('reg/', Register.as_view(), name='register'),
    path('', Login.as_view(), name='login'),
    path('check_username/', check_username, name='check_username'),
    path('logout/', logout, name='logout'),
]

urlpatterns += router.urls