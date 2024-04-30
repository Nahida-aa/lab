from django.db import models
from proj_base.utils.basemodels import BaseModel

class OAuthQQUser(BaseModel):
    """QQ登录⽤户数据"""
    user = models.ForeignKey('userapp.MyUser', 
                             # 当关联的 MyUser 对象被删除时，对应的 OAuthQQUser 对象也会被删除
                             on_delete=models.CASCADE, verbose_name='⽤户')
    openid = models.CharField(max_length=64, 
                              verbose_name='openid',db_index=True)
    class Meta:
        db_table = 'oauth_qq'
        verbose_name = 'QQ登录⽤户数据'
        verbose_name_plural = verbose_name