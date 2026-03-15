from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import(
    Category, Volume, Issue, Article, AuthorArticle, Submission, Review, Comment)
# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'article_count', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug':('name',)}
    readonly_fields = ['created_at']

    def article_count(self, obj):
        count = obj.articles.count()
        url = reverse('admin:journal_article_changelist') + f'?category__id__exact={obj.id}'
        return format_html('<a href="{}">{} articles </a>', url, count)
    article_count.short_description = 'Articles'

@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    list_display = ['number', 'year', 'is_current', 'issue_count', 'artice_count']
    list_filter = ['year', 'is_current']
    search_fields = ['number', 'year']

    def issue_count(self, obj):
        return obj.issues.count()
    issue_count.short_description = 'Issues'

    def article_count(self, obj):
        return obj.articles.count()
    article_count.short_description = 'Articles'

class ArticleInline(admin.TabularInline):
    model = Article
    extra = 0
    fields = ['title', 'status', 'pages']
    readonly_fields = ['title', 'status']
    can_delete = False
    show_change_link = True

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'publication_date', 'is_published', 'article_count']
    list_filter = ['volume', 'year', 'is_published']
    search_fields = ['volume__number', 'number', 'month']
    date_hierachy = 'publication_date'
    inlines = [ArticleInline]

    def article_count(self, obj):
        return obj.articles.count()
    article_count.short_description = 'Articles'

