from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Category, Volume, Issue, Article, AuthorArticle,
    Submission, Review, Comment
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name',
                    'affiliation', 'bio', 'orcid', 'role']
        read_only_fields = ['id', 'role']

class CatrgorySerializer(serializers.ModelSerializer):
    article_count = serializers.IntegerField(source='articles.count', read_only=True)

    class meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'article_count']
        