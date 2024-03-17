from django.db import models

# Create your models here.
class User(models.Model):
    is_delete = models.BooleanField(default=False)
    username = models.CharField(max_length=16, unique=True)
    password = models.CharField(max_length=40)
    email = models.EmailField(unique=True, null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    # create_time = models.DateTimeField(default=datetime.now)

    class Meta:
        # db_table = 'user'
        verbose_name = '用户'
        verbose_name_plural = verbose_name