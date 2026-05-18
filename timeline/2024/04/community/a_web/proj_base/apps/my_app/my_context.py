from .models import Article

def get_channels(request):
    # 获取导航栏的频道
    channels = Article.objects.order_by('id')
    return {'channels': channels}