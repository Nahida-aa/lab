# import eventlet
# eventlet.monkey_patch()

# celery_tasks/main.py

# celery启动⽂件

from celery import Celery

# 创建celery实例
celery_app = Celery('team')

# 加载celery配置
celery_app.config_from_object('celery_tasks.config')

# load tasks{加载异步任务}
celery_app.autodiscover_tasks([
    'celery_tasks.sms'
    # , 'celery_tasks.email'
    ]
)