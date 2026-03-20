from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = [
        ('author', 'Author'),
        ('reviewer', 'Reviewer'),
        ('editor', 'Editor'),
        ('admin', 'Administrator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='author')
    affiliation = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    orcid = models.CharField(max_length=19, blank=True, help_text="ORCID ID")
    is_verified = models.BooleanField(default=False)
    date_verified = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    @property
    def is_editor(self):
        return self.role in ['editor', 'admin']
    
    @property
    def is_reviewer(self):
        return self.role in ['reviewer', 'editor', 'admin']