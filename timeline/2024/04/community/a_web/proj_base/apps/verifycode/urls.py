from .views import *
from django.urls import path, re_path

urlpatterns = [
    re_path(r'^imgcodes/(?P<uuid>[\w-]+)/$', Imgcode.as_view(), name='imgcode'),
    re_path(r'^smscodes/(?P<phone>1[3-9]\d{9})/$', SMScode.as_view(), name='smscode'),
]