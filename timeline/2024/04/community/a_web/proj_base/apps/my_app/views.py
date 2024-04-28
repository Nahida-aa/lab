from django.shortcuts import render
from .models import Sentence
import random
from .models import Article
# 分页
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
# 本周热门
from django.utils import timezone
# 分类
from .models import Category
#详情页
##继承
from django.views.generic import ListView
from django.shortcuts import get_object_or_404
##点赞
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
##评论
from .models import Comment
# 登录验证
##类装饰器
from django.utils.decorators import method_decorator
# test
# from django.http import HttpResponse
import os
# from settings.dev import BASE_DIR
# from proj_base.settings.dev import BASE_DIR
from django.conf import settings
BASE_DIR = settings.BASE_DIR
# search
from haystack.generic_views import SearchView
import pprint

class MySearchView(SearchView):
    template_name = 'search/search.html' # 不用改, 写在这里是为了方便查看
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # pprint.pprint(context)

        #TODO 每日一句
        sentence_all = Sentence.objects.all()
        sentence = random.choice(sentence_all)
        context['sentence'] = sentence

        #TODO 缩略图(预览图)，右侧热门推荐
        article_hot_all = Article.objects.all().order_by('-look_num')[:5]
        context['article_hot_all'] = article_hot_all

        #TODO 右侧最新评论
        latest_comment = Comment.objects.all().order_by('-create_time')[:5]
        context['latest_comment'] = latest_comment
        return context

def test_template_file(request):
    try:
        with open(os.path.join(BASE_DIR, 'templates', 'search\\indexes\\my_app\\article_text.txt'), 'r') as file:
            return HttpResponse(file.read())
    except Exception as e:
        return HttpResponse(str(e))

# 登录验证装饰器
def is_login(func):
    def wrapper(request, *args, **kwargs):
        if 'user_id' in request.session:
            print('已登录')
            return func(request, *args, **kwargs)
        print('未登录')
        # return HttpResponseRedirect('http://127.0.0.1:8000/login/')
        # 对于ajax请求,返回json
        if request.is_ajax():
            return JsonResponse({
                'status': 400,
                'msg': '未登录',
                'redirect': '/login/',
            })
        # 对于正常请求,重定向
        return HttpResponseRedirect('/login/')
    return wrapper

# 登录验证class装饰器
class LoginRequiredMixin(object):
    @method_decorator(is_login)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)

# @csrf_exempt # 取消csrf验证(会带来安全问题,在html使用token验证)
@is_login # 登录验证
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
    
@csrf_exempt # 取消csrf验证(因为post请求会被验证)
@is_login # 登录验证
def zan(request):
    """
    处理点赞
    """
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

class Detail(ListView):
    """
    直接继承ListView, 会多获取一些数据, 应该没有什么影响(未验证)
    """
    model = Article
    template_name = 'detail.html'
    # context_object_name = 'article'
    # paginate_by = 5
    
    def get_context_data(self, **kwargs):
        context = super(Detail, self).get_context_data(**kwargs)
        # import pprint
        # pprint.pprint(context)
        # 详情页
        article = get_object_or_404(Article, name_en=self.kwargs['name_en'])
        context['article'] = article
        # pprint.pprint(context)
        # 文章浏览数+1
        article.look_num += 1
        article.save()

        # 每日一句
        sentence_all = Sentence.objects.all()
        sentence = random.choice(sentence_all)
        context['sentence'] = sentence

        return context

# def detail(request):
def detail(request, name_en):
    # 文章详情
    # name_en = request.GET.get('name_en')
    # article = Article.objects.get(name_en=name_en)
    article = get_object_or_404(Article, name_en=name_en)
    context={
        'article': article,
        }
    # 文章浏览数+1
    article.look_num += 1
    article.save()

    #TODO 每日一句
    sentence_all = Sentence.objects.all()
    sentence = random.choice(sentence_all)
    context['sentence'] = sentence

    #TODO 右侧缩略图,热门推荐
    article_hot_all = Article.objects.all().order_by('-look_num')[:5]
    context['article_hot_all'] = article_hot_all

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

    #TODO 右侧最新评论
    latest_comment = Comment.objects.all().order_by('-create_time')[:5]
    context['latest_comment'] = latest_comment
    return render(request, 'detail.html', context=context)

def category(request, name_en, page=1):
    # 分类
    category_name = Category.objects.get(name_en=name_en)

    #TODO 每日一句
    sentence_all = Sentence.objects.all()
    sentence = random.choice(sentence_all)

    # 文章
    # article_all = Article.objects.filter(category_s=name)
    article_all = Article.objects.filter(category_s__name_en=name_en)
    #TODO 分页
    paginator = Paginator(article_all, 5) # Show 5 contacts per page
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

    # 本周热门
    time_now = timezone.now()
    time_sun = time_now - timezone.timedelta(days=time_now.isoweekday())
    # time_sat = time_now + timezone.timedelta(days=6-time_now.isoweekday())
    #获取周一到当前时间的文章
    # 热门可以增加更多因素，进行加权
    article_week_hot = Article.objects.filter(create_time__gte=time_sun).order_by('-look_num')[:5]

    # 广告
    adv_article_all = Article.objects.filter(advertisement=True)[:3]

    #TODO 缩略图(预览图)，右侧热门推荐
    article_hot_all = Article.objects.all().order_by('-look_num')[:5]
    
    context={
        'category_name': category_name,
        'sentence': sentence,
        'article_all': article_all,
        'name_en': name_en,
        'article_week_hot': article_week_hot,
        'adv_article_all': adv_article_all,
        'article_hot_all': article_hot_all,
        }
    
    #TODO 右侧最新评论
    latest_comment = Comment.objects.all().order_by('-create_time')[:5]
    context['latest_comment'] = latest_comment
    return render(request, 'category.html', context=context)

class Index(ListView):   
    model = Article
    template_name = 'index.html'
    # context_object_name = 'article_all'
    # paginate_by = 5

    def get_queryset(self): 
        """
        if 不写这个函数, 会获取不到urk中的参数?(未验证)
        """
        return super(Index, self).get_queryset()
    
    def get_context_data(self, **kwargs):
        context = super(Index, self).get_context_data(**kwargs)
        # import pprint
        # pprint.pprint(context)
        # 分页
        article_all = Article.objects.all()
        paginator = Paginator(article_all, 5) # Show 5 contacts per page
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
        # print(article_all)
        # for article in article_all:
        #     print(article)
        # pprint.pprint(context)

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

        #TODO 每日一句
        sentence_all = Sentence.objects.all()
        sentence = random.choice(sentence_all)
        context['sentence'] = sentence

        #TODO 缩略图(预览图)，右侧热门推荐
        article_hot_all = Article.objects.all().order_by('-look_num')[:5]
        context['article_hot_all'] = article_hot_all

        #TODO 右侧最新评论
        latest_comment = Comment.objects.all().order_by('-create_time')[:5]
        context['latest_comment'] = latest_comment
        return context

def index_my(request):
    #TODO 每日一句
    sentence_all = Sentence.objects.all()
    sentence = random.choice(sentence_all)

    # 文章们
    article_all = Article.objects.all()
    # 分页
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

    # 本周热门
    time_now = timezone.now()
    time_sun = time_now - timezone.timedelta(days=time_now.isoweekday())
    # time_sat = time_now + timezone.timedelta(days=6-time_now.isoweekday())
    #获取周一到当前时间的文章
    # 热门可以增加更多因素，进行加权
    article_week_hot = Article.objects.filter(create_time__gte=time_sun).order_by('-look_num')[:5]

    # 广告
    adv_article_all = Article.objects.filter(advertisement=True)[:3]

    #TODO 缩略图(预览图)，右侧热门推荐
    article_hot_all = Article.objects.all().order_by('-look_num')[:5]

    context={
        'sentence': sentence,
        'article_all': article_all,
        'article_week_hot': article_week_hot,
        'adv_article_all': adv_article_all,
        'article_hot_all': article_hot_all,
        }
    print(article_all)

    #TODO 右侧最新评论
    latest_comment = Comment.objects.all().order_by('-create_time')[:5]
    context['latest_comment'] = latest_comment
    return render(request, 'index_my.html'
                #   , context=context
                  )

def index(request):
    # 每日一句
    # sentence_all = Sentence.objects.all()
    # sentence = random.choice(sentence_all)

    # 文章
    article_all = Article.objects.all()

    context={
        # 'sentence': sentence,
        'article_all': article_all,
        }
    # return render(request, 'index.html', context=context)
    return render(request, 'index_test.html', context=context)

class IndexTest(ListView):
    model = Article
    template_name = 'index_test.html'
    
    # def get_queryset(self):
    #     return Article.objects.all()
    # def get_context_data(self, **kwargs):
    #     context = super(IndexTest, self).get_context_data(**kwargs)
    #     context['sentence'] = random.choice(Sentence.objects.all())
    #     return context

def commentbox(request):
    # 评论
    # name = request.POST.get('name')
    # email = request.POST.get('email')
    # content = request.POST.get('content')
    # article_id = request.POST.get('article_id')
    # 保存到数据库
    # try:
    #     comment = Comment()
    #     comment.name = request.POST.get('name')
    #     comment.email = request.POST.get('email')
    #     comment.content = request.POST.get('content')
    #     comment.article_id = request.POST.get('article_id')
    #     comment.save()
    #     return JsonResponse({
    #         'status': 200,
    #         'msg': '评论成功',
    #     })
    # except:
    #     return JsonResponse({
    #         'status': 400,
    #         'msg': '评论失败',
    #     })
    # finally: # 不管是否异常，都获取所有评论
    #     comment_all = Comment.objects.filter(article_id=request.POST.get('article_id')).order_by('-create_time')[:100]
    #     data_list = []
    #     for comment in comment_all:
    #         data_list.append({
    #             'name': comment.name,
    #             'content': comment.content,
    #             # 'create_time': comment.create_time,
    #             #格式化时间
    #             'create_time': comment.create_time.strftime('%Y-%m-%d %H:%M:%S'),
    #         })
    #     return JsonResponse({
    #         'status': 201,
    #         'data': data_list,
    #         'msg': '获取评论成功',
    #     })
    return render(request, 'commentbox.html')