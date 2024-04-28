import logging
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
import string, random
from captcha.image import ImageCaptcha # pip install captcha
import django_redis
# 短信验证码api
from proj_base.utils.huyi_sms.sms3 import send_sms_code
# from utils.huyi_sms.sms3 import send_sms_code

logger = logging.getLogger('django')

class Imgcode(View):
    def get(self, request, uuid):
        # 随机生成一个验证码(4位数字)
        code_str = ''.join(random.choices(string.digits, k=4))
        # 根据4位数字生成一个图片
        code_img = ImageCaptcha().generate(code_str)
        # 保存到sredis中
        redis_conn = django_redis.get_redis_connection(alias='verify_code')
        redis_conn.setex(f'img_{uuid}', 300, code_str)
        # response返回图片
        return HttpResponse(code_img, content_type='image/png')
    
class SMScode(View):
    def get(self, request, phone):
        # 获取图片验证码
        imgcode = request.GET.get('imgcode', None)
        uuid = request.GET.get('uuid', None)
        if not all([phone, imgcode, uuid]):
            return JsonResponse({'code': 4001, 'msg': '缺少必传参数'})
        # 校验图片验证码
        redis_conn = django_redis.get_redis_connection(alias='verify_code')
        redis_imgcode = redis_conn.get(f'img_{uuid}')
        if not redis_imgcode:
            return JsonResponse({'code': 4002, 'msg': '图片验证码已过期'})
        if imgcode.lower() != redis_imgcode.decode().lower():
            return JsonResponse({'code': 4003, 'msg': '图片验证码错误'})
        # 验证成功后删除图片验证码
        try:
            redis_conn.delete(f'img_{uuid}')
        except Exception as e:
            # 记录日志
            logger.error(e)

        # 随机生成一个验证码(6位数字)
        smscode_str = ''.join(random.choices(string.digits, k=6))
        print(f'smscode_str:{{\n{smscode_str}\n}}')
        # 判断是否已经发送过短信
        smscode_has = redis_conn.get(f'sms_{phone}')
        # print(f'smscode_has:{{\n{smscode_has}\n}}')
        if smscode_has:
            print('短信验证码已发送，请稍后再试')
            return JsonResponse({'code': 4004, 'msg': '短信验证码已发送，请稍后再试'})
        # 保存到redis中
        # redis_conn.setex(f'sms_{phone}', 60, smscode_str)
        pl = redis_conn.pipeline()
        pl.setex(f'sms_{phone}', 60, smscode_str)
        pl.execute()

        # TODO: 异步
        from proj_base.celery_tasks.sms.tasks import huyi_send_sms_code
        # Celery异步发送短信
        ret = huyi_send_sms_code.delay(phone, smscode_str)
        print('开始发送短信')
        print(f'ret:{{\n{ret}\n}}')

        # red: task_id 存在说明已经被调用
        if ret:
            return JsonResponse({'code': 200, 'msg': 'OK'})
        else:
            # 未被调用
            return JsonResponse({'code': 5001, 'msg': '短信发送失败'})

        # TODO: 非异步
        # 发送短信
        # ret = send_sms(smscode_str, phone)
        # print(f'ret:{{\n{ret}\n}}')
        # if ret.get('code') == 2:
        #     return JsonResponse({'code': 200, 'msg': 'OK'})
        # elif ret.get('code') == 201:
        #     return JsonResponse({'code': 201, 'msg': '此功能已被禁用，请使用邮箱验证'})
        # else:
        #     return JsonResponse({'code': 5001, 'msg': '短信发送失败'})
    
    def post(self, request, phone):
        # 验证短信验证码
        smscode_client = request.POST.get('smscode')
        redis_conn = django_redis.get_redis_connection(alias='verify_code')
        smscode_server = redis_conn.get(f'sms_{phone}')

        if not smscode_client:
            return JsonResponse({'code': 4001, 'msg': '缺少短信验证码'})
        if not smscode_server:
            return JsonResponse({'code': 4002, 'msg': '短信验证码失效'})
        if smscode_client == smscode_server.decode('utf-8'):
            return JsonResponse({'code': 200, 'msg': 'OK'})
        else:
            return JsonResponse({'code': 4003, 'msg': '短信验证码错误'})