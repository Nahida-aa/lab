from django.urls import path
from .views import *

urlpatterns = [
    path('reg/', Register.as_view(), name='register'),
    path('', Login.as_view(), name='login'),
    path('check_username/', check_username, name='check_username'),
    path('logout/', logout, name='logout'),
]