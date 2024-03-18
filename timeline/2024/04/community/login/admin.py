from django.contrib import admin
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'password', 'email', 'create_time')
    list_per_page = 5
    fieldsets = (
        ('基本信息', {'fields': ('username', 'password', 'email')}),
    )
    search_fields = ('username', 'email')
    list_filter = ('create_time',)