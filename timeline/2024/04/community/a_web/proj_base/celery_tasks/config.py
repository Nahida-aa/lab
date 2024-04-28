# celery_tasks/config.py

# 指定消息队列的位置
broker_url= 'amqp://guest:guest@localhost:5672'
# 用新增的用户和密码，因为guest用户只能在本地访问(默认情况，我改了)
# broker_url= 'amqp://admin:admin@localhost:5672'