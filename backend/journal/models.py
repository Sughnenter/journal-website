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

class Issue(models.Model)
