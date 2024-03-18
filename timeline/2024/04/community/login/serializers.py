from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        """
        __all__ 代表所有字段
        """
        # fields = ['id', 'username', 'password', 'email', 'create_time']
