# blog_11

## environment

### conda create py311_env

```cmd
cd projects
conda env list
conda create --name py311_web python=3.11
conda env list
activate py311_web 
#conda activate py311_web # 旧版conda用这个
pip install django
pip list
```

### create project and app

```cmd
django-admin startproject blog11
code blog11
python manage.py startapp my_app
```

#### Register app

```py
INSTALLED_APPS = (
	...,
    'app_name',  # register app
)
```

### Write view func

```py
from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```



## 项目介绍

无

## 1model class

### 1.1每日一句

```json
'model_class': 'Sentence'
field: 时间、内容
```

```py
class Sentence(models.Model):
    content = models.TextField()
    def __str__(self):
        return self.content
    class Meta:
        verbose_name = '每日句子'
        verbose_name_plural = '每日句子'
```

### 1.2标签

```json
model_class: Tag
field: 标签名
```

```py
class Tag(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = '标签'
        verbose_name_plural = '标签'
```

### 1.3分类表

```py
class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = '分类'
        verbose_name_plural = '分类'
```

### 1.4文章表

```json
model_class: Article
field: title、作者、发布时间、修改时间、内容、分类、标签(多对多)、来源、围观、图片、点赞、广告位、缩略图
```

```py
class Article(models.Model):
    title = models.CharField('标题', max_length=100)
    # content = models.TextField('内容')
    content = UEditorField('内容', height=500, width=8000,
                           default=u'', blank=True, imagePath="img/", # /static/media/img/
                           toolbars='besttome', filePath='files/')
    img = models.ImageField('图片', upload_to='', null=True, blank=True)
    created_time = models.DateTimeField('创建时间', auto_now_add=True)
    modified_time = models.DateTimeField('修改时间', auto_now=True)
    source = models.CharField('来源', max_length=100, null=True, blank=True)
    # choices = (
    #     ('1', '原创'),
    #     ('2', '转载'),
    # )  
    # choices = (
    #     ('1', '前端'),
    #     ('2', '后端'),
    # )
    # classify = models.CharField('分类', max_length=20, choices=choices, default='2')
    category = models.ForeignKey(Category, verbose_name='分类', null=True, blank=True)
    def category_(self):
        return self.category
    category_.short_description = '分类'
    author = models.ForeignKey(User, verbose_name='作者', null=True, blank=True)
    def author_(self):
        return self.author
    author_.short_description = '作者'
    tags = models.ManyToManyField(Tag, verbose_name='标签')
    def tags_(self):
        return ','.join([tag.name for tag in self.tags.all()])
    tags_.short_description = '标签'
    look_num = models.PositiveIntegerField('阅读量', default=0)
    comment_num = models.IntegerField('评论量', default=0)
    like_num = models.IntegerField('点赞量', default=0)
    advertisement = models.BooleanField('是否广告', default=False)
    def __str__(self):
        return self.title
    class Meta:
        verbose_name = '文章'
        verbose_name_plural = '文章'
```

### 1.5评论表

```json
model_class: Comment
field: 昵称、邮箱、内容、时间、文章(外键关联)
实际上外键关联等可能因为需求变更导致经常改
```

```py
class Comment(models.Model):
    name = models.CharField('名字', max_length=50, null=True, blank=True)
    email = models.EmailField('邮箱', max_length=255, null=True, blank=True)
    content = models.TextField()
    created_time = models.DateTimeField('创建时间', auto_now_add=True)
    article = models.ForeignKey(Article, verbose_name='文章')

    def __str__(self):
        return self.content
    class Meta:
        verbose_name = '评论'
        verbose_name_plural = '评论'
```

## 2db迁移

```cmd
#全局检查 创建迁移
python manage.py makemigrations
#局部检查 创建迁移
python manage.py makemigrations my_app

#迁移
python manage.py migrate
```

## 3createsuperuser

```cmd
python manage.py createsuperuser
```

http://127.0.0.1:8000/admin/

## 4admin

```py
from django.contrib import admin
from my_app.models import Sentence, Tag, Category, Article, Comment
# Register your models here.
admin.site.register(Sentence)
admin.site.register(Tag)
admin.site.register(Category)
# admin.site.register(Article)
admin.site.register(Comment)

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):  
    list_display = ('title', 'content',
                    'category_', 'tags_', 
                    'author_', 'created_time', 'modified_time', 
                    'source', 'look_num', 'comment_num',
                    'like_num', 
                    )
```

## 5view

```py
from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'index.html')
```

```py
from django.conf.urls import include, url
from django.contrib import admin
from my_app.views import *

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^ueditor/',include('DjangoUeditor.urls' )),
    url(r'^$', index),
    url(r'^index/$', index),
]
```

## 6templates

选中 ctrl+r 替换

## 7显示每日一句

e.g.

```py
import random
print(random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
```

```py
from django.shortcuts import render
from .models import Sentence
import random

# Create your views here.
def index(request):
    sentence_all = Sentence.objects.all()
    sentence = random.choice(sentence_all)
    return render(request, 'index.html', {'sentence': sentence})
```

![image-20240203024414115](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240203024414115.png)

```html
<!-- <p>你是我人生中唯一的主角，我却只能是你故事中的一晃而过得路人甲。</p> -->
<p>{{ sentence.content }}</p>
```

### 7.2修改时间

```html
<!-- <h2>2015年11月1日 星期日</h2> -->
<h2 id="TimeDiv" style="font-size: 16px;"></h2>
```

```js
"9".padStart(2,0) // => '09'

123.toString(); // => '123'
```

## 8显示文章

```py
...
from .models import Article

def index(request):
    # 每日一句
    sentence_all = Sentence.objects.all()
    sentence = random.choice(sentence_all)

    # 文章
    article_all = Article.objects.all()

    context={
        'sentence': sentence,
        'article_all': article_all,
        }
    return render(request, 'index.html', context=context)
```

![image-20240203204050920](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240203204050920.png)

![image-20240203214538937](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240203214538937.png)

```html
{% for article in article_all %}
  <div class="news-list">
    <div class="news-img col-xs-5 col-sm-5 col-md-4"> 
      <a target="_blank" href=""><img src="static/img/logo.jpg" alt=""> </a> 
    </div>
    <div class="news-info col-xs-7 col-sm-7 col-md-8">
      <dl>
        <dt> <a href="" target="_blank"> {{ article.title }} </a> </dt>
        <dd>
          <span class="name">
            <a href="" title="由 {{ article.author.username }} 发布" rel="author">{{ article.author.username }}</a>
          </span> 
          <span class="identity"></span> 
          <span class="time"> {{ article.modified_time|date:'Y-m-d' }} </span>
        </dd>
        <dd class="text">{{ article.content|truncatechars:50|safe }}</dd> <!-- truncate{切去;缩短来的} -->
      </dl>
      <div class="news_bot col-sm-7 col-md-8"> 
        <span class="tags visible-lg visible-md">
          {% for tag in article.tags.all %} 
            <a href="">{{ tag.name }}</a> 
          {% endfor %}
        </span> 
        <span class="look"> 共 <strong>{{ article.look_num }}</strong> 人围观 </span>
      </div>
    </div>
  </div>
{% endfor %}
```

### 8.1图片路径bug

![image-20240204003840715](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240204003840715.png)

点击后

![image-20240204003859446](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240204003859446.png)

由

```py
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

# Media files
MEDIA_URL = 'static/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'static/media')
```

引起

修改如下

```py
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

# Media files
MEDIA_URL = '/static/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'static/media')
```

![image-20240204003958994](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240204003958994.png)

![image-20240204004451422](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240204004451422.png)

## 9base.html

可以直接复制index.html然后开始挖坑

不好用，有bug

## 10.content.html

![image-20240207134026950](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240207134026950.png)

![image-20240207134408331](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240207134408331.png)

![image-20240207134456549](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240207134456549.png)

```py
def content(request):
    # 每日一句
    sentence_all = Sentence.objects.all()
    sentence = random.choice(sentence_all)

    # 文章
    article_all = Article.objects.all()
    context={
        'sentence': sentence,
        'article_all': article_all,
        }
    return render(request, 'content.html', context=context)
```

```py
from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^$', index, name='index'),
    url(r'^index$', index, name='index'),
    url(r'^my_index/$', my_index, name='my_index'),
    url(r'^content/$', content, name='content'),
]
```

## 11index分页

```py
# 分页
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

def index(request):
    # 每日一句
    sentence_all = Sentence.objects.all()
    sentence = random.choice(sentence_all)

    # 文章
    article_all = Article.objects.all()
    # 分页
    paginator = Paginator(article_all, 10) # Show 5 contacts per page
    page = request.GET.get('page')
    try:
        article_all = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        #如果页面不是一个整数，则提供第一页。
        article_all = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        #如果页面超出范围（例如9999），则提供结果的最后一页。
        article_all = paginator.page(paginator.num_pages)

    context={
        'sentence': sentence,
        'article_all': article_all,
        }
    return render(request, 'index.html', context=context)
```

```html
<!-- 底部分页导航 -->
<style>
/* 去掉因换行导致的行内元素之间的空白 */
/* 子节点 margin-left: -4px; */
.quotes span,
.quotes a {
    margin-left: -2px;
}
.quotes span:first-child {
    margin-left: 0;
}
</style>
<div class="quotes" style="margin-top:15px">
{% if article.number == 1 %}
  <span class="disabled">首页</span>
{% else %}
  <a href="/">首页</a>
{% endif %}
{% if article.has_previous %}
  <a href="/?page={{ article.previous_page_number }}">上一页</a>
{% else %}
  <span class="disabled">上一页</span>
{% endif %}

<!-- 显示页码们 -->
{% for page_code in article_all.paginator.page_range %}
  <!-- 高亮当前页码且不给a标签 -->
  {% if page_code == article_all.number %}
    <span class="current">{{ page_code }}</span>
  <!-- 其他页码不高亮且给a标签 -->
  {% else %}
    <!-- 如果是首页页码就使悬停链接变成首页链接 -->
    {% if page_code == 1 %}
      <a href="/">{{ page_code }}</a>
    <!-- 否则正常页码链接 -->
    {% else %}
      <a href="/?page={{ page_code }}">{{ page_code }}</a>
    {% endif %}
  {% endif %}
{% endfor %}  

<!-- if有下一页，就显示下一页为a -->
{% if article.has_next %}
  <a href="/?page={{ article.next_page_number }}">下一页</a>
<!-- else就显示为span -->
{% else %}
  <span class="disabled">下一页</span>
{% endif %}

<!-- if当前页面是尾页，就显示为span -->
{% if article.number == article.paginator.num_pages %}
  <span class="disabled">尾页</span>
{% else %}
  <a href="/?page={{ article.paginator.num_pages }}">尾页</a>
{% endif %}
</div>
```

## 12本周热门排行

test

```py
from django.utils import timezone
from django.conf import settings
# settings.configure(USE_TZ=True) #只影响time_now.hour
settings.configure(USE_TZ=False) #仅测试时需要

time_now = timezone.now()
print(time_now) # 2024-02-08 20:22:05.477767
print(time_now.year) # 2024
print(time_now.month) # 2
print(time_now.day) # 8
print(time_now.hour) # 20, UTC_TZ=True时，为12。东八区，比UTC时间快8小时(即显示时间+8)
print(time_now.minute) # 22
print(time_now.second) # 5
print(time_now.microsecond) # 477767
print(time_now.tzinfo) # None 世界协调时间，USE_TZ=True时，为UTC
print(time_now.weekday()) # 3 0-6, 0为星期一
print(time_now.isoweekday()) # 4 1-7, 1为星期一

week_now = time_now.isoweekday() # 4
time_sun = time_now - timezone.timedelta(days=week_now) 
week_sun = time_sun.isoweekday() # 7
print(week_sun) # 7
# print(time_sun.weekday()) # 6
```

instance

```py
def index(request):
    #TODO 每日一句
    sentence_all = Sentence.objects.all()
    sentence = random.choice(sentence_all)

    # 文章
    article_all = Article.objects.all()
    #TODO 分页
    paginator = Paginator(article_all, 5) # Show 5 contacts per page
    page = request.GET.get('page')
    try:
        article_all = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        #如果页面不是一个整数，则提供第一页。
        article_all = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        #如果页面超出范围（例如9999），则提供结果的最后一页。
        article_all = paginator.page(paginator.num_pages)

    #TODO 本周热门
    time_now = timezone.now()
    time_sun = time_now - timezone.timedelta(days=time_now.isoweekday())
    # time_sat = time_now + timezone.timedelta(days=6-time_now.isoweekday())
    #获取周一到当前时间的文章
    article_week_hot = Article.objects.filter(create_time__gte=time_sun).order_by('-look_num')[:5]

    context={
        'sentence': sentence,
        'article_all': article_all,
        'article_week_hot': article_week_hot,
        }
    return render(request, 'index.html', context=context)
```

```html
<div class="content-block hot-content hidden-xs">
  <h2 class="title"><strong>本周热门排行</strong></h2>
  <ul>
    {% for awh in article_week_hot %}
      {% if forloop.counter == 1 %}
        <li class="large">
          <a href="content.html" target="_blank">
            <img src="/static/media//{{ awh.img }}" alt="">
            <h3> {{ awh.title }} </h3>
          </a>
        </li>
      {% else %}
        <li>
          <a href="content.html" target="_blank">
            <img src="/static/media//{{ awh.img }}" alt="">
            <h3> {{ awh.title }} </h3>
          </a>
        </li>
 p     {% endif %}
    {% endfor %}
  </ul>
</div>
```

## 13修改左侧

### 13.1找

## 14轮播图/广告位

前期在热度最高的三篇文章挂广告

## 15缩略图

更小的图片，更差的清晰度，可以占用更小空间，使页面加载更快

![image-20240211145941416](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240211145941416.png)

blog/settings.py

```py
THUMB_DIR = os.path.join(BASE_DIR, 'static/media/thumb')
```

```cmd
md static\media\thumb
```

my_app/models.py

```py
# 缩略图
from blog.settings import THUMB_DIR, MEDIA_ROOT, BASE_DIR
from PIL import Image # pip install pillow
from django.db.models.fields.files import ImageFieldFile
import os

def make_thumb(img_path, size=(80, 60)):
    """
    生成缩略图
    size: 渲染后的大小
    """
    # img = Image.open(img_path)
    # img.thumbnail(size, Image.ANTIALIAS)
    # img.save(img_path, 'JPEG')

    pix = Image.open(img_path).convert('RGB') # jpeg格式需要转换
    pix.thumbnail(size)
    return pix

class Article(models.Model):
    ...
    img = models.ImageField('图片', upload_to='', null=True, blank=True)
    thumb = models.ImageField('缩略图', upload_to='thumb/', null=True, blank=True) # /static/media/thumb/
    # def save(self, *args, **kwargs):
    #     if self.img:
    #         img_path = self.img.path
    #         img = make_thumb(img_path)
    #         thumb_path = img_path.replace('img', 'thumb')
    #         img.save(thumb_path, 'JPEG')
    #         self.thumb = thumb_path.replace(THUMB_DIR, '')
    #     super(Article, self).save(*args, **kwargs)
    def save(self, force_insert=False, force_update=False, using=None, 
             update_fields=None):
        # if self.img:
        #     img_path = self.img.path
        #     img = make_thumb(img_path)
        #     thumb_path = img_path.replace('img', 'thumb')
        #     img.save(thumb_path, 'JPEG')
        #     self.thumb = thumb_path.replace(THUMB_DIR, '')
        # super(Article, self).save(force_insert, force_update, using, update_fields)
        super(Article, self).save()
        # 获取大图的文件名及其后缀
        img_name, ext = os.path.splitext(os.path.basename(self.img.path))
        """
        self.img.path: ./1.jpg
        os.path.basename(self.img.path): 1.jpg
        os.path.splitext(os.path.basename(self.img.path)): ('1', '.jpg')
        """
        # 获取上传的大图路径
        img_path = os.path.join(MEDIA_ROOT, img_name + ext)
        """
        MEDIA_ROOT: /blog/static/media
        img_path: /blog/static/media/1.jpg
        """
        # 获取缩略图
        pix = make_thumb(img_path, size=(80, 60))
        # 缩略图保存路径
        thumb_path = os.path.join(THUMB_DIR, img_name + '_80x60' + ext)
        """
        THUMB_DIR: .../blog/static/media/thumb
        thumb_path: .../blog/static/media/thumb/1.jpg
        """
        # 缩略图保存
        pix.save(thumb_path)
        # 缩略图url保存到数据库
        save_url = thumb_path.split(BASE_DIR)[-1]
        """
        thumb_path: .../blog/static/media/thumb/1.jpg
        BASE_DIR: .../blog
        thumb_path.split(BASE_DIR): ['', '/static/media/thumb/1.jpg']
        save_url: /static/media/thumb/1.jpg
        """
        self.thumb = ImageFieldFile(self, self.thumb, save_url)
        # 
        super(Article, self).save()
   ...
```

在管理界面保存时如果提示不能为空

可以设置为可以为空

也可以在保存文章界面不显示该项

my_app/admin.py

```py
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):  
    ...
    fieldsets = (
        ('基本信息', {'fields': ('title', 'content', 'category_s', 'tags', 'source', 'author', 'img')}),
        ('其他信息', {'fields': ('advertisement', 'look_num', 'comment_num')}),
    )
```

### 15.2顺手优化管理界面

```py
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):  
    # 列表页显示的字段  
    list_display = ('title', 'thumb', 'img', 'content',
                    'category_s_', 'tags_', 
                    'author_', 'create_time', 'modify_time', 
                    'source', 'look_num', 'comment_num',
                    'like_num', 
                    )
    list_per_page = 5 # 分页, 每页显示10条 
    # date_hierarchy = 'create_time'
    # ordering = ('-create_time',)
    # filter_horizontal = ('tags',)
    # # fields = ('title', 'content', 'category', 'tags', 'source', 'author', 'look_num', 'comment_num')

    # 详情页显示的字段
    fieldsets = (
        ('基本信息', {'fields': ('title', 'content', 'category_s', 'tags', 'source', 'author', 'img')}),
        ('其他信息', {'fields': ('advertisement', 'look_num', 'comment_num')}),
    )

    # 搜索
    # search_fields = ('title', 'content', 'source', 'author', 'category_s', 'tags')
    search_fields = ('title', 'content', 'source', 'author__username', 'category_s__name', 'tags__name')

    # 过滤
    list_filter = ('category_s', 'tags', 'create_time', 'modify_time', 'author')
```

### 15.3显示热门推荐奇迹缩略图

```py
def index(request):
    ...
    # 缩略图(预览图)，右侧热门推荐
    article_hot_all = Article.objects.all().order_by('-look_num')[:5]

    context={
        ...,
        'article_hot_all': article_hot_all,
        }
    return render(request, 'index.html', context=context)
```

## 16文章中的表情等

插入表情等会显示为受损的图片

![image-20240213133707329](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240213133707329.png)

检查发现

```django
{{ article.content|truncatechars:50|safe }}
```

可以自定义过滤器(函数)

```cmd
md my_app/templatetags
```

![image-20240213134540787](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240213134540787.png)

test

```py
import re
text = '<span class="name"><a href="" title="由 {{ article.author.username }} 发布" rel="author">{{ article.author.username }}</a></span><title>个人技术博客</title>'
# reg = re.compile(r'<.*?>(.*?)<.*?>') # [^>]表示匹配任何不是>的字符。
reg = re.compile(r'<[^>]*>(.*?)<[^>]*>') # *表示前面的元素可以出现零次或多次。例如，a*可以匹配''（空字符串，因为这里a出现了零次），'a'，'aa'，'aaa'等。
reg = re.compile(r'<[^>]+>([^<]+)</[^>]+>') # +表示前面的元素必须至少出现一次。例如，a+可以匹配'a'，'aa'，'aaa'等，但不能匹配''（空字符串，因为这里a没有出现）。
# print(reg.findall(text, re.S)) # re.S参数使.特殊字符匹配任何字符，包括换行符。
print(reg.findall(text))
```

my_app/temlatetags/filter.py

```py
from django import template
import re

register = template.Library()

@register.filter
def my_filter(value, num=3):
    """
    获取文本前num个字符
    过滤掉html标签
    """
    reg = re.compile(r'<[^>]+>([^<]+)</[^>]+>')
    # value = reg.sub(r'\1', value)
    text_list = reg.findall(value)
    text = ','.join(text_list)
    return text[:num] # 获取前num个字符
```

```django
<dd class="text">
  {% load filter %}
  {{ article.content|my_filter:50 }}
  {% comment %} {{ article.content|truncatechars:50|safe }} {% endcomment %}
</dd> <!-- truncate{切去;缩短来的} -->
```

如有err可以尝试重新运行项目

# 2文章页

## 1继承

与首页有许多相同的内容，可以在view使用类继承

当然我更喜欢直接复制粘贴

```py
class Index(ListView):   
    model = Article
    template_name = 'index.html'
    # context_object_name = 'article_all'
    paginate_by = 5

    def get_queryset(self):
        return super(Index, self).get_queryset()
  
    def get_context_data(self, **kwargs):
        context = super(Index, self).get_context_data(**kwargs)
        # 分页
        article_all = Article.objects.all()
        paginator = Paginator(article_all, self.paginate_by) # Show 5 contacts per page
        page = self.request.GET.get('page')
        try:
            article_all = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            #如果页面不是一个整数，则提供第一页。
            article_all = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            #如果页面超出范围（例如9999），则提供结果的最后一页。
            article_all = paginator.page(paginator.num_pages)
        context['article_all'] = article_all
      
        # 每日一句
        sentence_all = Sentence.objects.all()
        sentence = random.choice(sentence_all)
        context['sentence'] = sentence

        # 本周热门
        time_now = timezone.now()
        time_sun = time_now - timezone.timedelta(days=time_now.isoweekday())
        # time_sat = time_now + timezone.timedelta(days=6-time_now.isoweekday())
        #获取周一到当前时间的文章
        # 热门可以增加更多因素，进行加权
        article_week_hot = Article.objects.filter(create_time__gte=time_sun).order_by('-look_num')[:5]
        context['article_week_hot'] = article_week_hot

        # 广告
        adv_article_all = Article.objects.filter(advertisement=True)[:3]
        context['adv_article_all'] = adv_article_all

        # 缩略图(预览图)，右侧热门推荐
        article_hot_all = Article.objects.all().order_by('-look_num')[:5]
        context['article_hot_all'] = article_hot_all

        return context
```

```py
urlpatterns = [
    ...,
    # url(r'^index$', index, name='index'),
    url(r'^index$', Index.as_view(), name='index'),
    ...,
]
```

## 2文章详情页

## 3上一篇下一篇

test

```py
list1 = [1, 2, 3]
list2 = [1, 2]
list3 = [1]
list4 = [0]
list5 = []
# print(list4.first())
print(list2[:1]) # [1]
print(list3[:1]) # [1]
print(list4[:1]) # [0]
print(list5[:1]) # []
print(list5[0]) # IndexError: list index out of range
```

instance

```py
    # 上一篇、下一篇
    # 上一篇
    previous_article = Article.objects.filter(create_time__lt=article.create_time).order_by('-create_time').first()
    """
    __lt 小于 __lte 小于等于
    """
    context['previous_article'] = previous_article
    # 下一篇
    next_article = Article.objects.filter(create_time__gt=article.create_time).order_by('create_time').first()
    context['next_article'] = next_article
```

```django
<nav class="page-nav"> 
  {% if previous_article %} 
    <span class="page-nav-prev">上一篇<br />
      <a href="../{{ previous_article.name_en }}/" rel="prev">{{ previous_article.title }}</a>
    </span> 
  {% endif %} 
  {% if next_article %} 
    <span class="page-nav-next">下一篇<br />
      <a href="../{{ next_article.name_en }}/" rel="next">{{ next_article.title }}</a>
    </span> 
  {% endif %}
</nav>
```

## 4点赞

检查找到位置

```html
<div class="zambia">
  <a href="javascript:;" name="zambia" rel="{{ article.id }}">
    <span class="glyphicon glyphicon-thumbs-up"></span> 赞（{{ article.like_num }}）
  </a>
</div>
```

```js
//ajax更新点赞值
$(function () {
  $(".content .zambia a").click(function () {
    var zambia = $(this);
    var id = zambia.attr("rel"); //对应id   
    zambia.fadeOut(1000); //渐隐效果   
    $.ajax({
      type: "POST",
      // url: "zambia.php",
      url: "/zan/",
      data: "id=" + id,
      // data: {"id": id}, 传递多个参数时一般这么写
      cache: false, //不缓存此页面   
      success: function (data) {
        zambia.html(data);
        zambia.fadeIn(1000); //渐显效果   
      }
    });
    return false;
  });
})
```

```py
urlpatterns = [
    ...,
    url(r'^zan/$', zan, name='zan'),
    ...,
]
```

```py
##点赞
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse

@csrf_exempt # 取消csrf验证(因为post请求会被验证)
def zan(request):
    try:
        # print('run')
        id_ = request.POST.get('id')
        # print(id_)
        article = get_object_or_404(Article, id=id_)
        # print('找到了文章')
        article.like_num += 1
        # print('点赞数+1')
        article.save()
        # print('保存成功')
        return JsonResponse({
            'status': 200,
            'data': article.like_num,
            'msg': '点赞成功',
        })
    except:
        return JsonResponse({
            'status': 400,
            'msg': '点赞失败',
        })
```

```js
$(function () {
  $(".content .zambia a").click(function () {
    var zambia = $(this);
    var id = zambia.attr("rel"); //对应id   
    console.log(id);
    // zambia.fadeOut(1000); //渐隐效果   
    // var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
      type: "POST",
      // url: "zambia.php",
      url: "/zan/",
      // data: "id=" + id,
      data: {"id": id}, // 传递多个参数时一般这么写
      // beforeSend: function(xhr) {
      //   xhr.setRequestHeader("X-CSRFToken", csrftoken);
      // },
      cache: false, //不缓存此页面   
      success: function (res) {
        console.log(res);
        if (res.status == 200) {
          var htm = `<span class="glyphicon glyphicon-thumbs-up"></span> 赞（${res.data}）`;
          zambia.html(htm);
          // zambia.html(res.data);
          // zambia.html('<span class="glyphicon glyphicon-thumbs-up"></span> 赞（' + res.data + '）');
        }
        // zambia.html(res.data); 
        // zambia.fadeIn(1000); //渐显效果   
      }
    });
    return false;
  });
})
```

### 4.1点赞次数限制

如果限制一个用户一天只能点一次

可以将信息缓存到session

```py
@csrf_exempt # 取消csrf验证(因为post请求会被验证)
def zan(request):
    try:
        # print('run')
        id_ = request.POST.get('id')
        # print(id_)
        article = get_object_or_404(Article, id=id_)
        # print('找到了文章')
    except:
        return JsonResponse({
            'status': 400,
            'msg': '要点赞的文章不存在',
        })
    else:
        # 一个ip一天只能给同一篇点赞一次
        zan_id = request.session.get('zan_%s' % id_)
        if not zan_id or zan_id != timezone.now().strftime('%Y-%m-%d'):
            # print('没有点赞过')
            article.like_num += 1
            # print('点赞数+1')
            article.save()
            # print('保存成功')
            request.session['zan_%s' % id_] = timezone.now().strftime('%Y-%m-%d')
            return JsonResponse({
                'status': 200,
                'data': article.like_num,
                'msg': '点赞成功',
            })
        else:
            return JsonResponse({
                'status': 400,
                'msg': '今天已经点赞过了',
            })
```

![image-20240218205308271](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240218205308271.png)

s的session_key对应b的cookie[sessionid]

sesion_data用的base64加密

[Base64 在线编码解码 | Base64 加密解密 - Base64.us](https://base64.us/)

![image-20240104142719840](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240104142719840.png)

## 5相关推荐

用户画像、深度学习

此处简单点

基于tags推荐

2019推荐

2023大模型

2025视觉、自然语言

```py
    # 相关推荐,基于标签
    tags = article.tags.all()
    # 获取标签相同的文章
    article_related_all = Article.objects.none()
    # 以下可以优化
    for tag in tags:
        # article_related_all.extend(tag.article_set.all())
        article_related_all = article_related_all | Article.objects.filter(tags=tag)
        """
        filter(tags=tag) :会查询包含tag的所有文章
        | :并集
        """
    # 去重
    article_related_all = article_related_all.distinct()
    # 排除自己
    article_related_all = article_related_all.exclude(id=article.id)
    # 如果不足8个,取最新的
    article_related_all_count = article_related_all.count()
    if article_related_all_count < 8:
        # 如果数量不足，再次获取所有文章，排除当前文章和已经获取的文章
        article_related_all = article_related_all | Article.objects.exclude(id=article.id).exclude(id__in=[article.id for article in article_related_all]).distinct()
        article_related_all = article_related_all[:8]
        article_related_all_count = article_related_all.count()
        if article_related_all_count < 8:
            article_related_all = list(article_related_all) + list(Article.objects.all().order_by('-create_time')[:8-article_related_all_count])
            # 顺序打乱
            random.shuffle(article_related_all)
            print('不重复的文章不足8个')
        else:
            pass
            print('相关文章不足够8个')
    else:
        # 随机排序取8个
        article_related_all = article_related_all.order_by('?')[:8]
    context['article_related_all'] = article_related_all
```

## 6评论

观察需求

![image-20240220011824574](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240220011824574.png)

```py
class Comment(models.Model):
    name = models.CharField('名字', max_length=50, null=True, blank=True)
    email = models.EmailField('邮箱', max_length=255, null=True, blank=True)
    content = models.TextField()
    create_time = models.DateTimeField('创建时间', auto_now_add=True)
    article = models.ForeignKey(Article, verbose_name='文章')

    def __str__(self):
        return self.content
    class Meta:
        verbose_name = '评论'
        verbose_name_plural = '评论'
```

```py
@csrf_exempt
def detail_comment(request):
    # d_comment_name = request.POST.get('d_comment_name')
    d_comment_id = request.POST.get('commentId')
    d_comment_name = request.POST.get('commentName')
    d_comment_email = request.POST.get('commentEmail')
    d_comment_content = request.POST.get('commentContent')
```

```django
<form action="comment.php" method="post" class="form-inline" id="comment-form">
    {% comment %} 传递文章id {% endcomment %}
    <input type="hidden" name="commentId" class="form-control" id="commentId" value="{{ article.id }}">
    <div class="comment-title">
      <div class="form-group">
        <label for="commentName">昵称：</label>
        <input type="text" name="commentName" class="form-control" id="commentName" placeholder="技术博客">
      </div>
      <div class="form-group">
        <label for="commentEmail">邮箱：</label>
        <input type="email" name="commentEmail" class="form-control" id="commentEmail"
          placeholder="admin@xxxx.com">
      </div>
    </div>
    <div class="comment-form">
      <textarea placeholder="你的评论可以一针见血" name="commentContent"></textarea>
      <div class="comment-form-footer"></div>

      <div class="comment-form-btn">
        <div class="comment-form-btn">
          <button type="submit" class="btn btn-default btn-comment">提交评论</button>
        </div>
      </div>
    </div>
</form>
```

### 6.2保存到数据库

```py
def detail_comment(request):
    # d_comment_name = request.POST.get('d_comment_name')
    d_comment_id = request.POST.get('commentId')
    d_comment_name = request.POST.get('commentName')
    d_comment_email = request.POST.get('commentEmail')
    d_comment_content = request.POST.get('commentContent')

    # 保存到数据库
    comment = Comment()
    comment.name = d_comment_name
    comment.email = d_comment_email
    comment.content = d_comment_content
    # comment.article = Article.objects.get(id=d_comment_id)
    comment.article_id = d_comment_id
    """第二种写法更简单"""
```

### 6.3ajax

html

```html
{% comment %} 使用ajax时action="comment.php"没影响 {% endcomment %}
<form action="comment.php" method="post" class="form-inline" id="comment-form">
    {% comment %} {% csrf_token %} {% endcomment %}
    {% comment %} 传递文章id {% endcomment %}
    <input type="hidden" name="commentId" class="form-control" id="commentId" value="{{ article.id }}">
    <div class="comment-title">
      <div class="form-group">
        <label for="commentName">昵称：</label>
        <input type="text" name="commentName" class="form-control" id="commentName" placeholder="技术博客">
      </div>
      <div class="form-group">
        <label for="commentEmail">邮箱：</label>
        <input type="email" name="commentEmail" class="form-control" id="commentEmail"
          placeholder="admin@xxxx.com">
      </div>
    </div>
    <div class="comment-form">
      <textarea placeholder="你的评论可以一针见血" name="commentContent"></textarea>
      <div class="comment-form-footer"></div>

      <div class="comment-form-btn">
        <div class="comment-form-btn">
          {% comment %} 注意有type="submit"，要加上onclick="return false" {% endcomment %}
          <button type="submit" class="btn btn-default btn-comment" onclick="return false">提交评论</button>
        </div>
      </div>
    </div>
</form>
```

js

```js
//ajax更新点赞值 和 评论
$(function () {
  ...

  // 定义更新评论函数-
  function update_comment(data) {
    $.post("/detail_comment/", data, function (res) {
      console.log(res);
      var h_total = ``;
      res.data.forEach(function (item, index) {
        h_total += `
          <li>
            <span class="face"><img src="/static/images/icon/icon.png" alt=""></span> 
            <span class="text">
              <strong>${item.name}</strong> (${item.create_time}) 说：<br />
              ${item.content}
            </span>
          </li> 
        `; 
      });
      var htm = `
        <ul>
          ${h_total}
        </ul>
      `;
      $(".comment-content").html(htm);
    });
  }
  // 发送评论
  $(".btn-comment").click(function () {
    var commentId = $("#commentId").val();
    var commentName = $("#commentName").val();
    var commentEmail = $("#commentEmail").val();
    var commentContent = $("#commentContent").val();
    // var commentContent = $("textarea[name='commentContent']").val();
    // var csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
    var csrfmiddlewaretoken = "{{ csrf_token }}";
    console.log(commentId, commentName, commentEmail, commentContent);
    if (commentName == "") {
      alert("昵称不能为空");
      return false; //阻止表单提交
    }
    if (commentEmail == "") {
      alert("邮箱不能为空");
      return false; //阻止表单提交
    }
    if (commentContent == "") {
      alert("评论内容不能为空");
      return false; //阻止表单提交
    }
    {% comment %} $.ajax({
      type: "POST",
      url: "/comment/",
      data: {
        "commentId": commentId,
        "commentName": commentName,
        "commentEmail": commentEmail,
        "commentContent": commentContent
      },
      // es6可以简写
      // data: {commentId, commentName, commentEmail, commentContent},
      cache: false, //不缓存此页面
      success: function (res) {
        console.log(res);
        if (res.status == 200) {
          alert(res.msg);
        }else{
          alert(res.msg);
        }
      }
    }); {% endcomment %}
    // 普通写法(非ajax)
    var data = { commentId, commentName, commentEmail, commentContent, csrfmiddlewaretoken };
    update_comment(data)
    {% comment %} $.post("/detail_comment/", data, function (res) {
      console.log(res);
      var h_total = ``
      res.data.forEach(function (item, index) {
        h_total += `
          <li>
            <span class="face"><img src="/static/images/icon/icon.png" alt=""></span> 
            <span class="text">
              <strong>${item.name}</strong> (${item.create_time}) 说：<br />
              ${item.content}
            </span>
          </li> 
        `;   
      });
      var htm = `
        <ul>
          ${h_total}
        </ul>
      `;
      $(".comment-content").html(htm);
    }); {% endcomment %}
    return false;
  });
  // 更新评论
  update_comment({ "commentId": $("#commentId").val(), "csrfmiddlewaretoken": "{{ csrf_token }}" });
```

py

```py
def detail_comment(request):
    # d_comment_name = request.POST.get('d_comment_name')
    d_comment_id = request.POST.get('commentId')
    d_comment_name = request.POST.get('commentName')
    d_comment_email = request.POST.get('commentEmail')
    d_comment_content = request.POST.get('commentContent')

    # 保存到数据库
    try:
        comment = Comment()
        comment.name = d_comment_name
        comment.email = d_comment_email
        comment.content = d_comment_content
        # comment.article = Article.objects.get(id=d_comment_id)
        comment.article_id = d_comment_id
        """第二种写法更简单"""
        comment.save()
        return JsonResponse({
            'status': 200,
            'msg': '评论成功',
        })
    except:
        return JsonResponse({
            'status': 400,
            'msg': '评论失败',
        })
    finally: # 不管是否异常，都获取所有评论
        comment_all = Comment.objects.filter(article_id=d_comment_id).order_by('-create_time')[:100]
        data_list = []
        for comment in comment_all:
            data_list.append({
                'name': comment.name,
                'content': comment.content,
                # 'create_time': comment.create_time,
                #格式化时间
                'create_time': comment.create_time.strftime('%Y-%m-%d %H:%M:%S'),
            })
        return JsonResponse({
            'status': 201,
            'data': data_list,
            'msg': '获取评论成功',
        })
```

## 7右侧最新评论

py

```py
def view_func(request)
    #TODO 右侧最新评论
    latest_comment = Comment.objects.all().order_by('-create_time')[:5]
    context['latest_comment'] = latest_comment
    return rendewe(request, 'template.html', context)
```

html

```html
<div class="sidebar-block comment">
    <h2 class="title"><strong>最新评论</strong></h2>
    <ul>
      {% for comment in latest_comment %}
        <li data-toggle="tooltip" data-placement="top" title="{{ comment.name }}的评论">
          <a target="_blank" href="">
            <span class="face"><img src="/static/images/icon/icon.png" alt=""></span> 
            <span class="text">
              <strong>{{ comment.name }}</strong> ({{ comment.create_time }}) 说：<br />
              {{ comment.content|truncatechars:30 }}
            </span>
          </a>
        </li>
      {% endfor %}
    </ul>
</div>
```

# 3登录、注册

可以新建一个app

```cmd
python manage.py startapp login
```

```py
INSTALLED_APPS = (
    ...,
    'login',
)
```

```py
class User(models.Model):
    is_delete = models.BooleanField(default=False)
    username = models.CharField(max_length=16, unique=True)
    password = models.CharField(max_length=40)
    email = models.EmailField(unique=True)
    create_time = models.DateTimeField(auto_now_add=True)
    # create_time = models.DateTimeField(default=datetime.now)

    class Meta:
        db_table = 'user'
        verbose_name = '用户'
        verbose_name_plural = verbose_name
```

```cmd
python manage.py makemigrations
python manage.py migrate
```

```py
from django.shortcuts import render
from django.views.generic import View
# Create your views here.
class Register(View):
    def get(self, request):
        return render(request, 'login/reg.html')
    def post(self, request):
        pass

class Login(View):
    def get(self, request):
        return render(request, 'login/login.html')
    def post(self, request):
        pass
```

```py
from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^reg/$', Register.as_view(), name='register'),
    url(r'^$', Login.as_view(), name='login'),
]
```

## 1注册

```js
// 失去焦点
$('.inputname').blur(function () {
    var username = $('.inputname').val();
    var csrf = $("input[name='csrfmiddlewaretoken']").val();

    var from_data = {
        "username": username,
        csrfmiddlewaretoken: csrf
    };
    //发送请求
    $.post('/login/check_username/', from_data, function (data) {
        if (data.status == 1) {
            $('.inputname').next().hide();
        } else {
            $('.inputname').next().html(data.msg).show().css("color", "red");
        }
    })

})
```

```py
from django.views.generic import View
from django.http import JsonResponse
from login.models import User
import hashlib

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
```

## 2登录

```py
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
        return JsonResponse({'status': 1, 'msg': '登录成功', 'url': '../'})
        """
        登录成功后，跳转到首页
        """
```

### 2.1简单的已登录显示

```html
  {% if request.session.username %}
  <li style="text-align: center; height: 20px;margin: 10px;padding:10px;">欢迎你，
    <span>{{ request.session.username }}</span>
  </li>
  <li><a href="/logout">退出</a></li>
  {% else %}
  <li style="text-align: center; height: 20px;margin: 10px;padding:10px;">欢迎你，
    <span>游客</span>
  </li>
  <li><a href="/login">登录</a></li>
  <li><a href="/register">注册</a></li>
  {% endif %}
```

### 2.2退出登录按钮

```py
# 退出登录 switch_user
def logout(request):
    if 'user_id' in request.session:
        del request.session['user_id']
        del request.session['username']
        # return JsonResponse({'status': 1, 'msg': '退出成功', 'url': '/'})
    return HttpResponseRedirect('/')
    # return JsonResponse({'status': 0, 'msg': '退出失败', 'url': '/'})
```

简单美化

```html
  {% if request.session.username %}
  <li class="login_username">欢迎你，
    <strong>{{ request.session.username }}</strong>
  </li>
  <li class="login_btn1"><a href="/login/logout">退出</a></li>
  {% else %}
  <li class="login_username">欢迎你，
    <span>游客</span>
  </li>
  <li id="login_btn2_on">
    <ul>
      <li class="login_btn2"><a href="/login">登录</a></li>
      <li class="login_btn2"><a href="login/register">注册</a></li>
    </ul>
  </li>
  {% endif %}
```

```css
.login_username {
  /* color: #fff; */
  /* font-size: 16px; */
  /* font-weight: bold; */
  text-align: center;
  background-color: greenyellow;
  width: 80%;
  /* padding: 10px; */
  margin: 10px auto;
  border-radius: 25%;
}
.login_btn1 {
  text-align: center;
  background-color: yellow;
  width: 50%;
  margin: 10px auto;
  border-radius: 50%;
}
li.login_btn2 {
  display: inline-block;
  text-align: center;
  background-color: yellow;
  width: 40%;
  margin: 10px auto;
  border-radius: 50%;
}
#login_btn2_on {
  text-align: center;
}
```

### 2.3登录验证(将登录作为评论的前提)

```py
# 登录验证装饰器
def is_login(func):
    def wrapper(request, *args, **kwargs):
        if 'user_id' in request.session:
            return func(request, *args, **kwargs)
        return HttpResponseRedirect('/login/')
    return wrapper
...
@is_login # 登录验证
def detail_comment(request):
    ...
@csrf_exempt # 取消csrf验证(因为post请求会被验证)
@is_login # 登录验证
def zan(request):  
    ...
```

两个都是ajax(局部刷新无法做到重定向)(才怪呢)

# 4全文检索

haystack支持中文检索

全文检索不同于特定字段的模糊查询，使用全文检索的效率更高，并且能够对于中文进行分词处理

- haystack：全文检索的框架，支持whoosh、solr、Xapian、Elasticsearc四种全文检索引擎，[点击查看官方网站](http://haystacksearch.org/)
- whoosh：纯Python编写的全文搜索引擎，虽然性能比不上sphinx、xapian、Elasticsearc等，但是无二进制包，程序不会莫名其妙的崩溃，对于小型的站点，whoosh已经足够使用，[点击查看whoosh文档](https://whoosh.readthedocs.io/en/latest/)
- jieba：一款免费的中文分词包，如果觉得不好用可以使用一些收费产品，[点击查看jieba文档](https://github.com/fxsjy/jieba)，由于这里搜素需要用到关键词

## 4.1安装需要的包

```
pip install django-haystack==2.6.0
pip install whoosh
pip install jieba
```

## 4.2修改源码

- 找到python环境下的haystack目录

```
/home/python/.virtualenvs/py_3/lib/python3.5/site-packages/haystack/backends/
```

windows:

```shell
D:\Anaconda3\envs\py36_yangtuo\Lib\site-packages\haystack\backends
```

在这个目录下创建一个 `ChineseAnalyzer.py` 的文件

```
import jieba
from whoosh.analysis import Tokenizer, Token

class ChineseTokenizer(Tokenizer):
    def __call__(self, value, positions=False, chars=False,
                 keeporiginal=False, removestops=True,
                 start_pos=0, start_char=0, mode='', **kwargs):
        t = Token(positions, chars, removestops=removestops, mode=mode,
                  **kwargs)
        seglist = jieba.cut(value, cut_all=True)
        for w in seglist:
            t.original = t.text = w
            t.boost = 1.0
            if positions:
                t.pos = start_pos + value.find(w)
            if chars:
                t.startchar = start_char + value.find(w)
                t.endchar = start_char + value.find(w) + len(w)
            yield t

def ChineseAnalyzer():
    return ChineseTokenizer()
```

复制whoosh_backend.py文件，改为如下名称 `whoosh_cn_backend.py` 打开复制出来的新文件，引入中文分析类，内部采用结巴分词

```
from .ChineseAnalyzer import ChineseAnalyzer
```

更改词语分析类 查找

```
analyzer=StemmingAnalyzer()
```

改为

```
analyzer=ChineseAnalyzer()
```

修改完成之后保存

## 4.3django配置

- 修改settings.py文件，安装应用haystack

  ```
  INSTALLED_APPS = (
    ...
    'haystack',
  )
  ```

- 在settings.py文件中配置搜索引擎

```
HAYSTACK_CONNECTIONS = {
    'default': {
        #使用whoosh引擎
        'ENGINE': 'haystack.backends.whoosh_cn_backend.WhooshEngine',
        #索引文件路径
        'PATH': os.path.join(BASE_DIR, 'whoosh_index'),
    }
}
#当添加、修改、删除数据时，自动生成索引
HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'
#设置每页显示的数目，默认是20，可以自己修改
HAYSTACK_SEARCH_RESULTS_PER_PAGE = 5
```

- 在根目录下的url.py中配置 url

```
 url(r'^search/', include('haystack.urls')),
```

- 在my_app目录下创建search_indexes.py文件

```
from haystack import indexes
from .models import Article

#指定对于某个类的某些数据建立索引
class ArticleInfoIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)

    def get_model(self):
        return Article

    def index_queryset(self, using=None):
        return self.get_model().objects.all()    
```

django haystack 的规定。要相对某个 app 下的数据进行全文检索，就要在该 app 下创建一个 search_indexes.py 文件，然后创建一个 XXIndex 类（XX 为含有被检索数据的模型，如这里的 Post），并且继承 SearchIndex 和 Indexable。

- 在templates目录下创建“search/indexes/my_app/”目录,并且在目录下创建一个article_text.txt的文本文件(注意有个易错点: indexes)

![img](D:\a_note\web\haystack支持中文检索\img\01.png)

- article_text.txt的文本文件 写入下面所有属性

```
#指定索引的属性
{{object.title}}
{{object.content}}
```

这个数据模板的作用是对 Post.title、Post.content 这两个字段建立索引，当检索的时候会对这两个字段做全文检索匹配，然后将匹配的结果排序后作为搜索结果返回。

-创建初始化索引

```
python manage.py rebuild_index
```

执行命令之后输入y回车确定生成所引

![img](D:\a_note\web\haystack支持中文检索\img\02.png)

执行完成之后会生成 `whoosh_index`的文件夹

![img](D:\a_note\web\haystack支持中文检索\img\03.png)

为什么要创建索引？索引就像是一本书的目录，可以为读者提供更快速的导航与查找。在这里也是同样的道理，当数据量非常大的时候，若要从这些数据里找出所有的满足搜索条件的是很耗时的，将会给服务器带来极大的负担。所以我们需要为指定的数据添加一个索引（目录），在这里是为 Post 创建一个索引，索引的实现细节是我们不需要关心的，我们只关心为哪些字段创建索引。

## 4.4搜索模板

搜索结果模板：在templates/search/目录下创建search.html

搜索结果进行分页，视图向模板中传递的上下文如下

- query：搜索关键字
- page：当前页的page对象
- paginator：分页paginator对象

视图接收的参数如下：

- 参数query表示搜索内容，传递到模板中的数据为query
- 参数page表示当前页码 根据列表页的模板来制作搜索结果页的模板

search.html 模板代码

```
<h2>Search</h2>

<form method="get" action="/search/">
    <table>
        {{ form.as_table }}
        <tr>
            <td> </td>
            <td>
                <input type="submit" value="Search">
            </td>
        </tr>
    </table>

    {% if query %}
        <h3>Results</h3>

        {% for result in page.object_list %}
            <p>
                <a href="{{ result.object.get_absolute_url }}">{{ result.object.title }}</a>
            </p>
        {% empty %}
            <p>No results found.</p>
        {% endfor %}

        {% if page.has_previous or page.has_next %}
            <div>
                {% if page.has_previous %}<a href="?q={{ query }}&page={{ page.previous_page_number }}">{% endif %}« Previous{% if page.has_previous %}</a>{% endif %}
                |
                {% if page.has_next %}<a href="?q={{ query }}&page={{ page.next_page_number }}">{% endif %}Next »{% if page.has_next %}</a>{% endif %}
            </div>
        {% endif %}
    {% else %}
        {# Show some example queries to run, maybe query syntax, something else? #}
    {% endif %}
</form>
```

完成之后就可以进行全文检索。

[127.0.0.1:8000/search/](http://127.0.0.1:8000/search/)

![image-20240225155116009](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240225155116009.png)

在其他页面进行搜素:

```html
  <!-- 搜素 -->
  <div id="search" class="sidebar-block search" role="search">
    <h2 class="title"><strong>搜索</strong></h2>
    <form class="navbar-form" action="/search/" method="get">
      <div class="input-group">
        <input type="text" class="form-control" size="35" placeholder="请输入关键字" name="q">
        <span class="input-group-btn">
          <button class="btn btn-default btn-search" type="submit">搜索</button>
          {% comment %} type="submit" 会自动提交给 action="/search/" {% endcomment %}
        </span>
      </div>
    </form>
  </div>
```

![image-20240225155226758](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240225155226758.png)

点击搜素就可以进入此页面

## 4.5视图添加额外上下文

- 利用首页作为搜索结果的展示页，值保留最新文章部分的前端代码
- 自定义视图需要继承 SearchView 全文检索的类

```python
from haystack.generic_views import SearchView
class PostSearchView(SearchView):
    template = 'search/search.html'
    def get_context_data(self, **kwargs):
        context = super(PostSearchView, self).get_context_data(**kwargs)
        # todo:右侧热门推荐
        h_p = Post.objects.all().order_by('-look')[:5]
        context["h_p"] = h_p
        # todo:右侧最新评论
        latest_comment = Comment.objects.all().order_by('-time')[:5]
        context["latest_comment"] = latest_comment
        # 每日一句
        sen_all = Sentence.objects.all()
        sen = random.choice(sen_all)
        context["sen"] = sen
        print(context)
        return context
```

调用父类的get_context_data 方法获取父类的上下文后返回一个字典对象。

page属性名字变成了page_obj，我们这里将整个父类的context上下文重新赋值给了page ``` {'page_obj': , 'title': 1, 'form': , 'paginator': , 'is_paginated': False, 'object_list': [], 'view': , 'query': '急速'}

## 4.6重新配置路由

```python
# url(r'^search/', include("haystack.urls")),  #http://127.0.0.1:8000/search
url(r'^search/', PostSearchView.as_view()),  #重写类视图
```



## 4.7搜索模板search.html自定义

```

```

分页时找不到context源码时可以: 打印

```py
pprint.pprint(context)
```

## 4.8将tag也添加为可搜素的对象

```txt
#指定索引的属性
{{object.title}}
{{object.content}}
{% for tag in object.tags.all %}
    {{ tag.name }}
{% endfor %}
{% for category_s in object.category_s.all %}
    {{ category_s.name }}
{% endfor %}
```



```cmd
python manage.py rebuild_index
```



# 5反爬

主要防 不管咱服务器死活的爬虫(例如: while)

另外校园网大家Ip可能相同导致：同学爬别人，把我的ip给封了，我就不能爬别人了

使用非关系型的数据库(可以快速读写)存{ip: 次数}

## 1Redis 

REmote DIctionary Server(Redis) 是一个由 Salvatore Sanfilippo 写的 key-value 存储系统，是跨平台的非关系型数据库。

Redis 是一个开源的使用 ANSI C 语言编写、遵守 BSD 协议、支持网络、可基于内存、分布式、可选持久性的键值对(Key-Value)存储数据库，并提供多种语言的 API。

*Redis 通常被称为数据结构服务器，因为值（value）可以是字符串(String)、哈希(Hash)、列表(list)、集合(sets)和有序集合(sorted sets)等类型。*

![image-20240226185334306](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240226185334306.png)

服务端

![image-20240226185450760](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240226185450760.png)

客户端

![image-20240226185548916](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240226185548916.png)

自动连接上了

```redis
keys *
```

![image-20240226190034729](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240226190034729.png)

```cmd
select 1
```

![image-20240226190148284](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240226190148284.png)

![image-20240226190250223](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240226190250223.png)

16个数据库任意切换

![image-20240226190453523](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240226190453523.png)

第二个数据库为空

## 2py&Redis

使用python连接redis数据库

```cmd
pip install redis
```

### 2.1配置及连接

blog/settings.py

```py
# 配置redis
REDIS_HOST = '127.0.0.1'
REDIS_PORT = 6379
REDIS_DB = 0 # 默认情况下就是0, 可以不写
```

```cmd
cd. > my_app/connectredis.py
```

my_app/connectredis.py

```py
from redis import StrictRedis # pip install redis
from django.conf import settings
# from blog.settings import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD

class MyRedis():
    conn = StrictRedis(host=settings.REDIS_HOST, 
                       port=settings.REDIS_PORT, 
                       db=settings.REDIS_DB, 
                    #    password=settings.REDIS_PASSWORD # 
                       )
    def set(self, key, value, ex=60*60): # ex=60*60 60分钟 存活时间 即封禁别人ip 1小时
        self.conn.set(key, value, ex)

    def get(self, key):
        return self.conn.get(key)
```

## 3中间件

```cmd
cd. > my_app/middleware.py
```

### 3.1

my_app/middleware.py

```py
from .connectredis import MyRedis
import time
from django.http import HttpResponseForbidden, JsonResponse

class RequestBlockMiddleware(object):
    def process_request(self, request):
        print('process_request')
```

### 3.2注册(激活)中间件

```py
MIDDLEWARE_CLASSES = (
    ...,
    'my_app.middleware.RequestBlockMiddleware', # 自定义中间件
)
```

测试是否生效

### 3.3编辑中间件

```py
from .connectredis import MyRedis
import time
from django.http import HttpResponseForbidden, JsonResponse

class RequestBlockMiddleware(object):
    def process_request(self, request):
        print('process_request')
        # print(request.META['REMOTE_ADDR'])
        # 用户请求, 先获取用户的ip
        ip = request.META['REMOTE_ADDR']

        # 连接redis
        redis = MyRedis()
        # 获取redis中的ip数据{ip: time}
        time_count = redis.get(ip)
        print(time_count)
        if not time_count:
            # 如果不存在, 说明是第一次请求, 设置ip的时间
            value = f'{time.time()}_{1}'
            redis.set(ip, value)
        else:
            # 如果存在, 判断是否在1秒内访问10次
            time_count = time_count.decode()
            time_, count = time_count.split('_')
            # 如果与当前时间相差小于1秒, 则访问次数+1
            if time.time() - float(time_) <= 1:
                count = int(count) + 1
                # 如果访问次数大于10, 则返回403
                if count > 10:
                    return HttpResponseForbidden('您的请求过于频繁, 请稍后再试')
                # 否则, 更新redis中的次数
                else:
                    value = f'{time_}_{count}'
                    redis.set(ip, value)
            # 如果与当前时间相差大于1秒, 则重新设置时间and次数
            else:
                if count >= 10:
                    # 相当于封禁60秒
                    if time.time() - float(time_) <= 60:
                        return HttpResponseForbidden('您的请求过于频繁, 请稍后再试')
                    else:
                        value = f'{time.time()}_{1}'
                        redis.set(ip, value)
                value = f'{time.time()}_{1}'
                redis.set(ip, value)
```

```cmd
get 127.0.0.1
```

![image-20240226223223550](C:\Users\aa\AppData\Roaming\Typora\typora-user-images\image-20240226223223550.png)

# 6部署

## 1linux

## extend
