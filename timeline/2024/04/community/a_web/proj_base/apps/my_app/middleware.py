from .connectredis import MyRedis
import time
from django.http import HttpResponseForbidden, JsonResponse

class RequestBlockMiddleware(object):
    # def __init__(self, get_response):
    #     self.get_response = get_response
    #     self.redis = MyRedis()
    #     self.block_time = 60*60 # 60分钟
    #     self.block_msg = '您的请求过于频繁, 请稍后再试'
    #     self.block_key = 'block_'
    #     self.block_time_key = 'block_time_'

    # def __call__(self, request):
    #     # print('RequestBlockMiddleware')
    #     ip = request.META['REMOTE_ADDR']
    #     # print(ip)
    #     key = self.block_key + ip
    #     block_time_key = self.block_time_key + ip
    #     if self.redis.get(key):
    #         return JsonResponse({'msg': self.block_msg})
    #     if self.redis.get(block_time_key):
    #         return JsonResponse({'msg': self.block_msg})
    #     response = self.get_response(request)
    #     return response

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
            print('第一次请求')
            redis.set(ip, f'{time.time()}_{1}')
        else:
            # 如果存在, 判断是否在1秒内访问10次
            time_count = time_count.decode()
            time_, count = time_count.split('_')
            # 如果与当前时间相差小于1秒, 则访问次数+1
            if time.time() - float(time_) <= 1:
                count = int(count) + 1
                # 如果访问次数大于10, 则返回403
                if count > 10:
                    print('开始封禁')
                    return HttpResponseForbidden('您的请求过于频繁, 请稍后再试')
                # 否则, 更新redis中的次数
                else:
                    print('增加次数')
                    redis.set(ip, f'{time_}_{count}')
            # 如果与当前时间相差大于1秒, 则重新设置时间and次数
            else:
                print(int(count))
                if int(count) >= 10:
                    # 相当于封禁60秒
                    print(time_)
                    if time.time() - float(time_) <= 60:
                        print(f'封禁时间剩余: {60 - (time.time() - float(time_))}秒')
                        return HttpResponseForbidden('您的请求过于频繁, 请稍后再试')
                    else:
                        print('解封')
                        redis.set(ip, f'{time.time()}_{1}')
                else:
                    print('重新设置时间and次数')
                    redis.set(ip, f'{time.time()}_{1}')

    # def process_exception(self, request, exception):
    #     print('process_exception')
        # ip = request.META['REMOTE_ADDR']
        # key = self.block_key + ip
        # block_time_key = self.block_time_key + ip
        # self.redis.set(key, 1)
        # self.redis.set(block_time_key, 1, self.block_time)
        # return HttpResponseForbidden(self.block_msg)