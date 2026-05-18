from rest_framework import serializers
from .models import (
    # LoginUser,
    MyUser,
    )
from .models import Employee, DeptModel
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import exceptions
from django.contrib.auth import authenticate  
from django.utils.translation import gettext_lazy as _  

# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)

#         # Add custom claims
#         token['username'] = user.username
#         return token
    
#     def validate(self, attrs):
#         credentials = {
#             'username': '',
#             'password': attrs.get("password")
#         }

#         username_field = MyUser.USERNAME_FIELD
#         if username_field in attrs:
#             credentials['username'] = attrs[username_field]

#         user = MyUser.objects.filter(username=credentials['username']).first()

#         if user is None or not user.is_active:
#             raise exceptions.AuthenticationFailed(
#                 _('No active account found with the given credentials')
#                 # 未找到具有给定凭据的有效帐户
#             )

#         data = {}
#         refresh = self.get_token(user)
#         """
#         header{标头}.payload{有效载荷}.signature{签名}
#         """
        
#         # data['refresh'] = str(refresh)
#         data['refresh'] = refresh.__str__()
#         data['access'] = str(refresh.access_token)

#         return data

class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'password', 'email', 'date_joined']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': True,
            },
            'username': {
                'required': True,
            },
        }
    def create(self, validated_data):
        user = MyUser.objects.create_user(**validated_data)
        return user

# class LoginUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LoginUser
#         # fields = '__all__'
#         """
#         __all__ 代表所有字段
#         """
#         fields = ['id', 'username', 'password', 'email', 'date_joined']

#         extra_kwargs = {
#             'password': {
#                 'write_only': True,
#                 'required': True,
#                 # 'min_length': 6,
#                 # 'max_length': 20,
#             },
#             'username': {
#                 'required': True,
#                 # 'min_length': 6,
#                 # 'max_length': 20,
#             },
#             # 'email': {
#             #     'required': True,
#             # },
#         }

    #但这会报错,因为LoginUser没有create_user方法
    # def create(self, validated_data):
    #     """如果不重写create方法,那么在创建用户的时候,密码是明文
    #     if不重写会call ModelSerializer的create方法
    #     """
    #     user = LoginUser.objects.create_user(**validated_data)
    #     # user = User.objects.create_superuser(**validated_data)
    #     """
    #     create_user方法是User类的一个自定义方法,用于创建用户
    #     create_superuser方法是User类的一个自定义方法,用于创建超级用户,默认is_superuser=True
    #     """
    #     return user

class EmployeeSerializer(serializers.ModelSerializer):
    # 新增一个字段，仅仅是用来展示(不是数据库中的字段)(用于序列化)
    income = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Employee
        fields = '__all__'
        # 校验规则
        # 为字段添加额外的参数
        extra_kwargs = {
            'name': {
                'required': True,
                'min_length': 1,
                'max_length': 20,
            },
            # 'job': {'required': True},
            # 'entry_date': {'required': True},
            'sal': {'required': True},
            'bonus': {
                # 'required': True,
                # 'allow_null': True,
                'min_value': 100,
                'max_value': 1000,
                # 'write_only': True,
            },
        }

    def get_income(self, emp):
        return emp.sal + emp.bonus

class DeptModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeptModel
        fields = '__all__'

class EmployeeSerializer2(serializers.ModelSerializer):
    # dept = DeptModelSerializer()
    dept_name = serializers.CharField(source='dept.name', read_only=True)
    class Meta:
        model = Employee
        fields = '__all__'
    def create(self, validated_data):
        dept_data = validated_data.pop('dept')
        dept = DeptModel.objects.create(**dept_data)
        emp = Employee.objects.create(dept=dept, **validated_data)
        return emp
    def update(self, instance, validated_data):
        # dept_data = validated_data.pop('dept')
        # dept = instance.dept
        # instance.name = validated_data.get('name', instance.name)
        # instance.job = validated_data.get('job', instance.job)
        # instance.entry_date = validated_data.get('entry_date', instance.entry_date)
        # instance.sal = validated_data.get('sal', instance.sal)
        # instance.bonus = validated_data.get('bonus', instance.bonus)
        # instance.is_leave = validated_data.get('is_leave', instance.is_leave)
        # dept.name = dept_data.get('name', dept.name)
        # dept.address = dept_data.get('address', dept.address)
        # dept.save()
        # instance.save()
        # return instance
        pass