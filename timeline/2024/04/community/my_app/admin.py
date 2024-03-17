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
        ('基本信息', {'fields': ('name_en', 'title', 'content', 'category_s', 'tags', 'source', 'author', 'img')}),
        ('其他信息', {'fields': ('advertisement', 'look_num', 'comment_num')}),
    )

    # 搜索
    # search_fields = ('title', 'content', 'source', 'author', 'category_s', 'tags')
    search_fields = ('title', 'content', 'source', 'author__username', 'category_s__name', 'tags__name')

    # 过滤
    list_filter = ('category_s', 'tags', 'create_time', 'modify_time', 'author')
# admin.site.register(Article, ArticleAdmin)