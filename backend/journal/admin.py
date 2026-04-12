from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import (
    Category, Volume, Issue, Article, AuthorArticle,
    Submission, Review, Comment
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'article_count', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']
    
    def article_count(self, obj):
        count = obj.articles.count()
        url = reverse('admin:journal_article_changelist') + f'?category__id__exact={obj.id}'
        return format_html('<a href="{}">{} articles</a>', url, count)
    article_count.short_description = 'Articles'


@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    list_display = ['number', 'year', 'is_current', 'issue_count', 'article_count']
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
    date_hierarchy = 'publication_date'
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
    prepopulated_fields = {'slug': ('title',)}
    autocomplete_fields = ['corresponding_author', 'category']
    readonly_fields = ['created_at', 'updated_at', 'views_count', 'downloads_count']
    inlines = [AuthorArticleInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'abstract', 'keywords', 'category')
        }),
        ('Publication Details', {
            'fields': ('volume', 'issue', 'pages', 'doi', 'corresponding_author')
        }),
        ('Files', {
            'fields': ('manuscript_file', 'published_pdf')
        }),
        ('Status & Dates', {
            'fields': ('status', 'submitted_date', 'accepted_date', 'published_date')
        }),
        ('Metadata', {
            'fields': ('views_count', 'downloads_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['publish_articles', 'accept_articles', 'send_to_review']
    
    def title_short(self, obj):
        return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title
    title_short.short_description = 'Title'
    
    def volume_issue(self, obj):
        if obj.volume and obj.issue:
            return f"Vol. {obj.volume.number}, Issue {obj.issue.number}"
        return "-"
    volume_issue.short_description = 'Volume/Issue'
    
    def publish_articles(self, request, queryset):
        updated = queryset.update(status='published', published_date=timezone.now())
        self.message_user(request, f'{updated} article(s) published successfully.')
    publish_articles.short_description = "Publish selected articles"
    
    def accept_articles(self, request, queryset):
        updated = queryset.update(status='accepted', accepted_date=timezone.now())
        self.message_user(request, f'{updated} article(s) accepted.')
    accept_articles.short_description = "Accept selected articles"
    
    def send_to_review(self, request, queryset):
        updated = queryset.update(status='under_review')
        self.message_user(request, f'{updated} article(s) sent to review.')
    send_to_review.short_description = "Send to review"


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = [
        'title_short', 'submitter_name', 'category', 'status',
        'page_count', 'submitted_at', 'action_buttons'
    ]
    list_filter = ['status', 'category', 'submitted_at']
    search_fields = ['title', 'abstract', 'submitter__username', 'submitter__email']
    date_hierarchy = 'submitted_at'
    readonly_fields = ['submitted_at', 'updated_at', 'submitter', 'page_count']
    
    fieldsets = (
        ('Manuscript Information', {
            'fields': ('title', 'abstract', 'keywords', 'category')
        }),
        ('Author Information', {
            'fields': ('submitter', 'co_authors')
        }),
        ('Files', {
            'fields': ('manuscript_file', 'cover_letter')
        }),
        ('Review & Status', {
            'fields': ('status', 'admin_notes', 'converted_to_article')
        }),
        ('Timestamps', {
            'fields': ('submitted_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['accept_submissions', 'reject_submissions', 'convert_to_article']
    
    def title_short(self, obj):
        return obj.title[:50] + '...' if len(obj.title) > 50 else obj.title
    title_short.short_description = 'Title'
    
    def submitter_name(self, obj):
        if not obj.submitter:
            return '—'
        full = obj.submitter.get_full_name()
        return full if full.strip() else obj.submitter.username  # fallback if name not set
    submitter_name.short_description = 'Submitter'
    
    def action_buttons(self, obj):
        if obj.status == 'pending':
            review_url = reverse('admin:journal_submission_change', args=[obj.pk])
            return format_html(
                '<a class="button" href="{}">Review</a> ',
                review_url
            )
        return obj.get_status_display()
    action_buttons.short_description = 'Actions'
    
    def accept_submissions(self, request, queryset):
        updated = queryset.update(status='accepted')
        self.message_user(request, f'{updated} submission(s) accepted.')
    accept_submissions.short_description = "Accept selected submissions"
    
    def reject_submissions(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} submission(s) rejected.')
    reject_submissions.short_description = "Reject selected submissions"
    
    def convert_to_article(self, request, queryset):
        current_issue = Issue.objects.filter(
            is_published=True,
            volume__is_current=True
        ).order_by('-publication_date').first()

        if not current_issue:
            self.message_user(request, 'No active issue found.', level='error')
            return

        # Calculate the next available start page in this issue
        last_article = Article.objects.filter(
            issue=current_issue
        ).order_by('-id').first()

        next_start_page = 1
        if last_article and last_article.pages:
            try:
                # Parse "45-67" → take the end page + 1
                end = int(last_article.pages.split('-')[-1].strip())
                next_start_page = end + 1
            except (ValueError, IndexError):
                pass

        count = 0
        for submission in queryset.filter(status='accepted', converted_to_article=None):
            # Build page range from next_start_page + submission page count
            page_count = submission.page_count or extract_page_count(submission.manuscript_file)
            if page_count:
                end_page = next_start_page + page_count - 1
                pages = f"{next_start_page}-{end_page}"
                next_start_page = end_page + 1  # advance for the next article in batch
            else:
                pages = ''  # leave blank if we couldn't extract

            article = Article.objects.create(
                title=submission.title,
                abstract=submission.abstract,
                keywords=submission.keywords,
                category=submission.category,
                corresponding_author=submission.submitter,
                manuscript_file=submission.manuscript_file,
                status='under_review',
                submitted_date=submission.submitted_at,
                volume=current_issue.volume,
                issue=current_issue,
                pages=pages,            # ← auto-filled
            )

            submission.converted_to_article = article
            submission.status = 'converted'
            submission.save()

            AuthorArticle.objects.create(
                article=article,
                author=submission.submitter,
                order=1,
                is_corresponding=True
            )
            count += 1

        self.message_user(
            request,
            f'{count} submission(s) converted and assigned to {current_issue} with pages auto-filled.'
        )

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
        ('Assignment', {
            'fields': ('article', 'reviewer', 'status')
        }),
        ('Review Content', {
            'fields': ('recommendation', 'comments_to_author', 'comments_to_editor')
        }),
        ('Ratings', {
            'fields': ('originality', 'methodology', 'significance', 'clarity')
        }),
        ('Timestamps', {
            'fields': ('invited_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def article_title(self, obj):
        return obj.article.title[:50]
    article_title.short_description = 'Article'
    
    def reviewer_name(self, obj):
        if not obj.reviewer:
            return '—'
        return obj.reviewer.get_full_name() or obj.reviewer.username


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['article_title', 'user_name', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['article__title', 'user__username', 'content']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    
    actions = ['approve_comments', 'reject_comments']
    
    def article_title(self, obj):
        return obj.article.title[:50]
    article_title.short_description = 'Article'
    
    def user_name(self, obj):
        if not obj.user:
            return '—'
        return obj.user.get_full_name() or obj.user.username
    
    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} comment(s) approved.')
    approve_comments.short_description = "Approve selected comments"
    
    def reject_comments(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} comment(s) rejected.')
    reject_comments.short_description = "Reject selected comments"


# Admin site header customization
admin.site.site_header = "Journal of Applied Sciences - Administration"
admin.site.site_title = "Journal Admin"
admin.site.index_title = "Journal Management Dashboard"
