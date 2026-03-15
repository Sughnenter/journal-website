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

class AuthorArticleInline(admin.TabularInline):
    model = AuthorArticle
    extra = 1
    autocomplete_fields = ['author']
    fields = ['author', 'order', 'is_corresponding']


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = [
        'title_short', 'category', 'status', 'volume_issue',
        'views_count', 'downloads_count', 'published_date'
    ]
    list_filter = ['status', 'category', 'volume', 'published_date']
    search_fields = ['title', 'abstract', 'keywords', 'doi']
    date_hierarchy = 'published_date'
    prepopulated_fields = {'slug':('title',)}
    autocomplete_fields = ['corresponding_author', 'category']
    readonly_fields = ['created_at', 'updated_at', 'views_count', 'downloads_count']
    inlines = [AuthorArticleInline]

    fieldsets = (
        ('Basic Information',{
            'fields':('title', 'slug', 'abstract', 'keywords', 'category')
        }),
        ('Publication Details', {
            'fields':('volume', 'issue', 'pages', 'doi', 'corresponding_author')
        }),
        ('Files' , {
            'fields': ('manuscript_file', 'published_pdf')
        }),
        ('Status and Dates', {
            'fields':('status', 'submitted_date', 'accepted_date', 'published_date')
        }),
        ('Metadata', {
            'fields': ('views_count', 'downloads_count', 'created_at', 'updated_at'),
            'classes':('collapse',)
        }),
    )

    actions = ['publish_articles', 'accept_articles', 'send_to_review']

    def title_short(self, obj):
        return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title
    title_short.short_description = 'title'

    def volume_issue(self, obj):
        if obj.volume and obj.issue:
            return f"vol. {obj.volume.number}, Issue {obj.issue.number}"
        return "-"
    volume_issue.short_description = 'Volume/Issue'

    def publish_articles(self, request, queryset):
        updated = queryset.update(status='published', published_date=timezone.now())
        self.message_user(request, f'{updated} article(s) published succesfully.')
    publish_articles.short_description = 'publish Selected articles'

    def accept_articles(self, request, queryset):
        updated =  queryset.update(status='accepted', accepted_date=timezone.now())
        self.message_user(request, f'{updated} article(s) accepted.')
    accept_articles.short_description = 'Accept Selected articles'

    def send_to_review(self, request, queryset):
        updated = queryset.update(status='under_review')
        self.message_user(request, f'{updated} article(s) sent to review.')
    send_to_review.short_description = "send to review"
        