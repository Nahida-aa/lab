from django.db import models
from django.utils import timezone
from django.contrib.auth.models import (
    AbstractUser, Group, Permission
)
from django.utils.translation import gettext_lazy as _

# Create your models here.
# class LoginUser(models.Model):
#     is_active = models.BooleanField(
#         _("active"),
#         default=True,
#         help_text=_(
#             "Designates whether this user should be treated as active. "
#             "Unselect this instead of deleting accounts."
#         ),
#         # 指定是否应将此用户视为活动用户。取消选择此选项而不是删除帐户。
#     )
#     username = models.CharField(max_length=16, unique=True)
#     password = models.CharField(max_length=40)
#     email = models.EmailField(unique=True, null=True, blank=True)
#     date_joined = models.DateTimeField(_("date joined"), default=timezone.now)
#     # create_time = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         # db_table = 'login_user'
#         verbose_name = '用户'
#         verbose_name_plural = verbose_name

class MyUser(AbstractUser):
    phone = models.CharField(max_length=11, verbose_name='手机号', null=True, blank=True
                                #  , unique=True
                                 )
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="myuser_set",  # Add or change the related_name
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="myuser_set",  # Add or change the related_name
        related_query_name="user",
    )
    class Meta(AbstractUser.Meta):
        db_table = 'my_user'
        # verbose_name = _("user")
        # verbose_name_plural = _("users")
    
    def __str__(self):
        return self.username

class JobChoices(models.TextChoices):
    """枚举类"""
    MR = 'MR', '部门经理'
    CE = 'CE', '普通雇员'
    PR = 'PR', '总裁级别'

# 员工的模型类
class Employee(models.Model):
    name = models.CharField(verbose_name='员工姓名', max_length=20, unique=True)
    job = models.CharField(verbose_name='员工职位', max_length=2, choices=JobChoices.choices, default=JobChoices.CE)
    entry_date = models.DateField(verbose_name='入职日期', default=timezone.now)
    sal = models.IntegerField(verbose_name='级别薪资')
    bonus = models.SmallIntegerField(verbose_name='津贴', default=0)
    is_leave = models.BooleanField(verbose_name='是否离职', default=False)
    dept = models.ForeignKey('DeptModel', verbose_name='员工所属的部门', related_name='emps_list', null=True, blank=True, on_delete=models.SET_NULL)

    # 表示：员工拥有一个身份证，员工和身份证之间是一对一的关系
    # id_card = models.OneToOneField('demo4.IdCard', null=True, blank=True, on_delete=models.CASCADE)

    # 表示：员工拥有的多个角色，员工和角色之前是多对多的关系。在数据库通过第三张表来描述的。
    # 可以自己定义第三张表的名字：db_table='t_emp_roles'
    # roles = models.ManyToManyField('demo4.RoleModel', related_name='role_emps_list', db_table='t_emp_roles', null=True, blank=True)

    class Meta:
        db_table = 't_emp'
        verbose_name = '员工表'
        verbose_name_plural = verbose_name
        ordering = ['id']

    def __str__(self):
        # get_ + 属性名字 + _display
        return f"当前的员工是:{self.name}, 职位:{self.get_job_display()}"


# 部门， 之前存在有层级关系（一对多）
# 一个类，内部之前的一对多关系，也叫树形结构模型类，
class DeptModel(models.Model):
    name = models.CharField(verbose_name='部门名字', max_length=20, unique=True)
    address = models.CharField(verbose_name='部门地址', max_length=100, null=True, blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 't_dept'
        verbose_name = '部门表'
        verbose_name_plural = verbose_name
        ordering = ['id']

    def __str__(self):
        # get_ + 属性名字 + _display
        return f"当前的部门是:{self.name}"