from django.urls import path, re_path
from .views import *

urlpatterns = [
    path("", index, name="index"),
    # path("about/", about, name="about"),
    # path("contact/", contact, name="contact"),
    # path("list/", article_list, name="list"),
    # path("detail/<int:id>/", article_detail, name="detail"),
    # path("edit/<int:id>/", article_edit, name="edit"),
    # path("delete/<int:id>/", article_delete, name="delete"),
    # path("ckeditor/", include("ckeditor_uploader.urls")),
    path("search/", MySearchView.as_view(), name="haystack_search"),
    path('zan/', zan, name='zan'),
    path('detail_comment/', detail_comment, name='detail_comment'),
    path('commentbox/', commentbox, name='commentbox'),
    path('commentbox/', commentbox, name='commentbox'),
    re_path(r'^(?P<name_en>[^/]+)/$', detail, name='detail'),
]