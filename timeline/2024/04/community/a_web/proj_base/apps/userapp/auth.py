from django.contrib.auth.backends import ModelBackend
import re
from .models import MyUser
from django.db.models import Q


class MutiIdentityLoginAuth(ModelBackend):
    """
    自定义用户认证
    """
    def authenticate(self, request, identifier=None, password=None, **kwargs):
        """
        重写认证方法
        :param request: 请求对象
        :param identifier: 用户名或邮箱或手机号
        :param password: 密码
        :param kwargs: 其他参数
        :return: 用户对象
        """
        # 根据用户名或或邮箱或手机号查询用户
        try:
            if re.match(r'^1[3-9]\d{9}$', identifier):
                user = MyUser.objects.get(Q(mobile=identifier) | Q(username=identifier))
            elif re.match(r'^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$', identifier):
                user = MyUser.objects.get(Q(email=identifier) | Q(username=identifier))
            else:
                user = MyUser.objects.get(username=identifier)
        except MyUser.DoesNotExist:
            return None
        # 校验密码
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
