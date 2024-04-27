from redis import StrictRedis # pip install redis
from django.conf import settings
# from blog.settings import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD

class MyRedis():
    conn = StrictRedis(host=settings.REDIS_HOST, 
                       port=settings.REDIS_PORT, 
                       db=settings.REDIS_DB, 
                    #    password=settings.REDIS_PASSWORD # 
                       )
    def set(self, key, value, ex=60*60): # ex=60*60 60分钟 存活时间
        self.conn.set(key, value, ex)

    def get(self, key):
        return self.conn.get(key)