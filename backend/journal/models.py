from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator

User = get_user_model

# Create your models here.
class Journal(models.Model):
    AUTHOR_TITLE_CHOICES=(
        ('mr','MR'),
        ('dr','DR'),
        ('mrs', 'MRS')
        )
    Title = models.TextField(max_length=200)
    Abstract = models.TextField(max_length=300)
    Author_title = models.CharField()
    Author = models.TextField(choices=AUTHOR_TITLE_CHOICES)

    class Meta:
        verbose_name = _("Journal")
        verbose_name_plural = _("Journals")

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("Journal_detail", kwargs={"pk": self.pk})
