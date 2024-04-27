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