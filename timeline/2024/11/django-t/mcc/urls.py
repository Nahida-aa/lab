# example/urls.py
from django.urls import path

from mcc.views import index


urlpatterns = [
    path('', index),
]