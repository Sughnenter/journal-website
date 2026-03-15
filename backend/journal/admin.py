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

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = [
        'title_short', 'submitter_name', 'category', 'status',
        'submitted_at', 'action_buttons'
    ]
    list_filter = ['status', 'categoty','submitted_at']
    search_fields = ['title', 'abstract', 'submitter__username', 'submitter__email']
    date_hierachy = 'submitted_at'
    readonly_fields = ['submitted_at', 'updated_at', 'submitter']

    fieldsets = (
        ('ManuScript Information', {
            'fields':('title', 'abstract', 'keywords', 'category')
        }),
        ('Author Information', {
            'fields':('submitter', 'co_authors')
        }),
        ('Files', {
            'fields':('manuscript_file', 'cover_letter')
        }),
        ('Review and Status', {
            'fields':('status', 'admin_notes', 'converted_to_article')
        }),
        ('Timestamps', {
            'fields':('submitted_at', 'updated_at'),
            'cclasses':('collapse',)
        }),
    ) 

    actions = ['accept_submissions', 'reject_submissions', 'convert_to_article']

    def title_short(self, obj):
        return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title 
    title_short.short_description = 'Title'

    def submitter_name(self, obj):
        return obj.submitter.get_full_name()
    submitter_name.short_description = 'Submitter'

    def action_buttons(self, obj):
        if obj.status  == 'pending':
            return format_html(
                '<a class="button" href="#">Review </a> ' 
                '<a class="button" href="#">Accept </a> ' 
                '<a class="button" href="#">Reject </a> ' 
            )
        return '-'
    action_buttons.short_description = 'Actions'

    def accept_submissions(self, request, queryset):
        updated = queryset.update(status='accepted')
        self.message_user(request, f'{updated} submission(s) accepted.')
    accept_submissions.short_description = 'Accept Selected Submissions'

    def reject_submissions(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} submission(s) rejected.')
    reject_submissions.short_description = 'Reject selected submissions'

    def convert_to_article(self, request, queryset):
        # Convert selected submissions to articles
        count = 0
        for submission in queryset.filter(status='accepted', convert_to_article=None):
            # Create article from submission
            article = Article.objects.create(
                title=submission.title,
                abstract=submission.abstract,
                keywords=submission.keywords,
                category=submission.category,
                corresponding_author=submission.submitter,
                manuscript_file=submission.manuscript_file,
                status='under_review',
                submitted_date=submission.submitted_at
            )

            # Link Submission to article
            submission.converted_to_article = article
            submission.save()

            # Add Submitter as First author
            AuthorArticle.objects.create(
                article=article,
                author=submission.submitter,
                order=1,
                is_corresponding=True
            )

            count += 1

        self.message_user(request, f'{count} submission(s) converted to articles.')
    convert_to_article.short_description = 'Convert to Article'


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        'article_title', 'reviewer_name', 'status', 'recommendation',
        'invited_at', 'completed_at'
    ]
    list_filter = ['status', 'recommendation', 'invited_at']
    search_fields = ['article__title', 'reviewer__username', 'reviewer__email']
    date_hierarchy = 'invited_at'
    readonly_fields = ['invited_at', 'completed_at']
    autocomplete_fields = ['article', 'reviewer']

    fieldsets = (
        ('Assignment',{
            'fields:'('article', 'reviewer', 'status')
        }),
        ('Review Content',{
            'fields:'('recommendation', 'comments_to_author', 'comments_to_editor')
        }),
        ('Ratings',{
            'fields:'('originality', 'mehodology', 'significance', 'clarity')
        }),
        ('Timestamps',{
            'fields':('invited_at', 'completed_at'),
            'classes':('collapse',)
        }),
    )

    def article_title(self, obj):
        return obj.article.title[:50]
    article_title.short_description = 'Article'

    def reviewer_name(self, obj):
        return obj.reviewer.get_full_name()
    reviewer_name.short_description = 'Reviewer'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['article_title', 'user_name', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['article__title', 'user__username', 'content']
    date_hierachy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']

    actions = ['approve_comments', 'reject_comments']

    def article_title(self, obj):
        return obj.article.title[:50]
    article_title.short_description = 'Article'

    def user_name(self, obj):
        return obj.user.get_full_name()
    user_name.short_description = 'User'

    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} comment(s) approved.')
    approve_comments.short_description = 'Approve selected comments'

    def reject_comments(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message(request, f'{updated} comment(s) rejected')
    reject_comments.short_description = 'Reject selected comments'


# Admin Site header customization
admin.site.site_header = 'Journal of Biological Science - Administration'
admin.site.site_title = 'Journal Admin'
admin.site.index_title = 'Journal Management Dashboard'