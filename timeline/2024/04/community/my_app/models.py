from django.db import models
# from DjangoUeditor.models import UEditorField
from ckeditor.fields import RichTextField # pip install django-ckeditor
# from django_ckeditor_5.fields import CKEditor5Field # pip install django-ckeditor-5
from django.contrib.auth.models import User
# 缩略图
from blog11.settings import THUMB_DIR, MEDIA_ROOT, BASE_DIR
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

class Sentence(models.Model):
    content = models.TextField()
    def __str__(self):
        return self.content
    class Meta:
        verbose_name = '每日句子'
        verbose_name_plural = '每日句子'

class Tag(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = '标签'
        verbose_name_plural = '标签'

class Category(models.Model):
    name = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100, null=True, blank=True)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = '分类'
        verbose_name_plural = '分类'
# 文章、页面、说说
class Article(models.Model):
    name_en = models.CharField('英文名', max_length=100, null=True, blank=True)
    title = models.CharField('标题', max_length=100)
    # content = models.TextField('内容')
    # content = UEditorField('内容', height=500, width=8000,
    #                        default=u'', blank=True, imagePath="img/", # /static/media/img/
    #                        toolbars='besttome', filePath='files/')
    # content = models.TextField('内容')
    content = RichTextField('内容')
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
    
    #重写save方法
    def save(self, force_insert=False, force_update=False, using=None, 
             update_fields=None):
        # if self.img:
        #     img_path = self.img.path
        #     img = make_thumb(img_path)
        #     thumb_path = img_path.replace('img', 'thumb')
        #     img.save(thumb_path, 'JPEG')
        #     self.thumb = thumb_path.replace(THUMB_DIR, '')
        # super(Article, self).save(force_insert, force_update, using, update_fields)
        super(Article, self).save() # 先将大图保存到数据库
        if self.img:
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
            MEDIA_ROOT: /blog/media
            img_path: /blog/media/1.jpg
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
            save_url = thumb_path.split(sep=str(BASE_DIR))[-1]
            """
            sep{separator{分隔符}}
            thumb_path: .../blog/static/media/thumb/1.jpg
            BASE_DIR: .../blog
            thumb_path.split(BASE_DIR): ['', '/static/media/thumb/1.jpg']
            save_url: /static/media/thumb/1.jpg
            """
            self.thumb = ImageFieldFile(self, self.thumb, save_url)
            # 
            super(Article, self).save() # 再次保存

    create_time = models.DateTimeField('创建时间', auto_now_add=True)
    modify_time = models.DateTimeField('修改时间', auto_now=True)
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
    # category = models.ForeignKey(Category, verbose_name='分类', null=True, blank=True)
    category_s = models.ManyToManyField(Category, verbose_name='分类', null=True, blank=True)
    def category_s_(self):
        return ','.join([category.name for category in self.category_s.all()])
    category_s_.short_description = '分类'
    author = models.ForeignKey(User, verbose_name='作者', null=True, blank=True, on_delete=models.SET_NULL)
    def author_(self):
        return self.author
    author_.short_description = '作者'
    tags = models.ManyToManyField(Tag, verbose_name='标签', null=True, blank=True)
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

class Comment(models.Model):
    name = models.CharField('名字', max_length=50, null=True, blank=True)
    email = models.EmailField('邮箱', max_length=255, null=True, blank=True)
    content = models.TextField()
    create_time = models.DateTimeField('创建时间', auto_now_add=True)
    article = models.ForeignKey(Article, verbose_name='文章', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.content
    class Meta:
        verbose_name = '评论'
        verbose_name_plural = '评论'
