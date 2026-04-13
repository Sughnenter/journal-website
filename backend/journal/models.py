from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from .utils import extract_page_count

User = get_user_model()

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    def __str__(self):
        return self.name


class Volume(models.Model):
    number = models.IntegerField(unique=True)
    year = models.IntegerField()
    description = models.TextField(blank=True)
    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ['-number']

    def __str__(self):
        return f"volume {self.number} ({self.year})"

    def save(self, *args, **kwargs):
        if self.is_current:
            Volume.objects.filter(is_current=True).update(is_current=False)
        super().save(*args, **kwargs)

class Issue(models.Model):
    volume = models.ForeignKey(Volume, on_delete=models.CASCADE, related_name='issues') 
    number = models.IntegerField()
    month = models.CharField(max_length=20)
    year = models.IntegerField()
    publication_date = models.DateField()
    is_published = models.BooleanField(default=False)
    cover_image = models.ImageField(upload_to='issues.covers/', null=True, blank=True)

    class meta:
        ordering = ['-year', '-number']
        unique_together = ['volume', 'number']

    def __str__(self):
        return f"Vol. {self.volume.number}, Issue {self.number} ({self.month} {self.year})"

class Article(models.Model):

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('published', 'Published'),
        ('rejected', 'Rejected'),
    ]
    #Basic Information
    title = models.CharField(max_length=500)
    slug = models.SlugField(max_length=500, unique=True, blank=True)
    abstract = models.TextField()
    keywords = models.CharField(max_length=500, help_text="comma-seperated Keywords")

    #Categorization
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='articles')
    volume = models.ForeignKey(Volume, on_delete=models.SET_NULL, null=True, related_name='articles')
    issue = models.ForeignKey(Issue, on_delete=models.SET_NULL, null=True, related_name='articles')

    #Authors
    authors = models.ManyToManyField(User, related_name='articles', through='AuthorArticle')
    corresponding_author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='corresponding_articles')

    #Publication Details
    pages = models.CharField(max_length=20, blank=True, help_text="e.g./ 45-67")
    doi = models.CharField(max_length=100, unique=True, blank=True, null=True, default=None)

    # Files
    manuscript_file = models.FileField(
        upload_to='manuscripts/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])],
        null=True,
        blank=True
    )
    published_pdf = models.FileField(
        upload_to='published/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])],
        null=True,
        blank=True
    )

    # Status and Dates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_date = models.DateTimeField(null=True, blank=True)
    accepted_date = models.DateTimeField(null=True, blank=True)
    published_date = models.DateTimeField(null=True, blank=True)

    # Metadata
    views_count = models.IntegerField(default=0)
    downloads_count = models.IntegerField(default=0)

    # TimeStamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['published_date', '-created_at']
        indexes = [
            models.Index(fields=['status', 'published_date']),
            models.Index(fields=['category', 'published_date']),
        ]
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:500]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def is_published(self):
        return self.status == 'published'
    
    def get_keywords_list(self):
        return[k.strip() for k in self.keywords.split(',') if k.strip()]
    def clean(self):
        if self.issue and not self.issue.is_published:
            raise ValidationError({
                'issue': 'Cannot assign an article to a closed issue. '
                    'Please select an active published issue.'
            })


class AuthorArticle(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    is_corresponding = models.BooleanField(default=False)

    class Meta:
        ordering =['order']
        unique_together = ['article', 'author']

    def __str__(self):
        return f"{self.author.get_full_name()} - {self.article.title[:50]}"


class Submission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('revision_requested', 'Revision Requested'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    # Manuscript Information
    title = models.CharField(max_length=500)
    abstract = models.TextField()
    keywords = models.CharField(max_length=500)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)

    # Submitter
    submitter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    co_authors = models.TextField(blank=True, help_text="Co-authors names and affiliations")

    # Files
    manuscript_file = models.FileField(
        unique='submissions/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]
    )
    cover_letter = models.FileField(
        upload_to='submissions/cover_letters/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])],
        null=True,
        blank=True
    )

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)

    # Conversion
    converted_to_article = models.OneToOneField(
        Article,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='original_submission'
    )

    # Timestamps
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    page_count = models.IntegerField(null=True, blank=True, help_text="Auto-extracted from manuscript")

    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.title} - {self.submitter.get_full_name()}"

    def save(self, *args, **kwargs):
        # Extract page count AFTER saving so the file is fully written first
        is_new = self.pk is None
        super().save(*args, **kwargs)  # ← save first, file is now on disk
        
        if is_new and self.manuscript_file and not self.page_count:
            try:
                self.page_count = extract_page_count(self.manuscript_file)
                if self.page_count:
                    # Save only the page_count field, don't re-trigger full save
                    Submission.objects.filter(pk=self.pk).update(page_count=self.page_count)
            except Exception:
                pass  # page count is optional, never block submission


class Review(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('declined', 'Declined'),
    ]
    
    RECOMMENDATION_CHOICES = [
        ('accept', 'Accept'),
        ('minor_revision', 'Minor Revision'),
        ('major_revision', 'Major Revision'),
        ('reject', 'Reject'),
    ]

    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')

    # Review Content
    comments_to_author = models.TextField(blank=True)
    comments_to_editor = models.TextField(blank=True)
    recommendation = models.CharField(max_length=20, choices=RECOMMENDATION_CHOICES, blank=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    invited_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Ratings (1 -5 Scale)
    originality = models.IntegerField(null=True, blank=True)
    methodology = models.IntegerField(null=True, blank=True)
    significance= models.IntegerField(null=True, blank=True)
    clarity = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-invited_at']
        unique_together = ['article', 'reviewer']
    
    def __str__(self):
        return f"Review by {self.reviewer.get_full_name()} for {self.article.title[:50]}"


class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"comment by {self.user.username} on {self.article.title[:50]}"