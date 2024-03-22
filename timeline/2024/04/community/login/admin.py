from django.contrib import admin
from .models import (
    LoginUser,
    MyUser,
    )
from .models import Employee, DeptModel

# Register your models here.
@admin.register(MyUser)
class MyUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_active', 'is_staff', 'is_superuser')
    list_per_page = 5
    fieldsets = (
        ('基本信息', {'fields': ('username', 'email', 'is_active', 'is_staff', 'is_superuser')}),
    )
    search_fields = ('username', 'email')
    list_filter = ('is_active', 'is_staff', 'is_superuser')

    
@admin.register(LoginUser)
class LoginUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'password', 'email', 'date_joined')
    list_per_page = 5
    fieldsets = (
        ('基本信息', {'fields': ('username', 'password', 'email')}),
    )
    search_fields = ('username', 'email')
    list_filter = ('date_joined',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'job', 'entry_date', 'sal', 'bonus', 'is_leave', 'dept')
    list_per_page = 5
    fieldsets = (
        ('基本信息', {'fields': ('name', 'job', 'entry_date', 'sal', 'bonus', 'is_leave', 'dept')}),
    )
    search_fields = ('name',)
    list_filter = ('entry_date', 'is_leave')

@admin.register(DeptModel)
class DeptModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'parent')
    list_per_page = 5
    fieldsets = (
        ('基本信息', {'fields': ('name', 'address', 'parent')}),
    )
    search_fields = ('name',)
    list_filter = ('name',)