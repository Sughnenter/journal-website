from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator

User = get_user_model

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
    doi = models.CharField(max_length=100, unique=True, blank=True)

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
            models.Indeex(fields=['category', 'published_date']),
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