from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.utils import timezone

# Register your models here.
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'affiliation', 'is_verified', 'date_joined']
    list_filter = ['role', 'is_verified', 'is_staff', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'affiliation']
    ordering = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Journal Information', {
            "fields": ('role', 'affiliation', 'bio', 'profile_picture', 'phone', 'orcid' )
        }),
        ('Verification', {
            'fields':('is_verified', 'date_verified')
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info',{
            'fields':('role', 'affiliation', 'email', 'first_name', 'last_name')
        }),
    )

    actions = ['verify_users', 'make_reviewer', 'make_editor']

    def verify_users(self, request, queryset):
        updated = queryset.update(is_verified=True, date_verified=timezone.now())
        self.message_user(request, f'{updated} user(s) Verified successfully.')
    verify_users.short_description = 'Verify Selected Users'

    def make_reviewer(self, request, queryset):
        updated = queryset.update(role='reviewer')
        self.message_user(request, f'{updated} user (s) made reviewer(s).')
    make_reviewer.short_description = 'Make selected users reviewers'

    def make_editor(self, request, queryset):
        updated = queryset.update(role='editor')
        self.message_user(request, f'{updated} user(s) made editor(s).')
    make_editor.short_description = "Make Selected user(s) editor"