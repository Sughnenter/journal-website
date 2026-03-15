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


class VolumeSerializer(serializers.ModelSerializer):
    issue_count = serializers.IntegerField(source='issues.count', read_only=True)

    class Meta:
        model = Volume
        fields = ['id', 'number', 'year', 'description', 'is_current', 'issue_count']


class IssueSerializer(serializers.ModelSerializer):
    volume_number = serializers.IntegerField(source='volume.number', read_only=True)
    article_count = serializers.IntegerField(source='articles.count', read_only=True)

    class Meta:
        model = Issue
        fields = ['id', 'volume', 'volume_number', 'number', 'month', 'year',
                    'publication_date', 'is_published', 'cover_image', 'article_count'
                ]

class AuthorArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_affiliation = serializers.CharField(source='author.affiliation', read_only=True)
    author_email = serializers.EmailField(source='author.email', read_only=True)

    class Meta:
        model = AuthorArticle
        fields = ['id', 'author', 'author_name', 'author_affiliation', 'author_email',
                    'order', 'is_corresponding']


class ArticleListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    authors = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'abstract', 'category', 'category_name',
                    'authors', 'published_date', 'doi', 'views_count', 'downloads_count']

    def get_authors(self, obj):
        author_articles = obj.authorarticle_set.all().order_by('order')
        return [aa.author.get_full_name() for aa in author_articles]


class ArticleDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    authors = AuthorArticleSerializer(source='authorarticle_set', many=True, read_only=True)
    corresponding_author_name = serializers.CharField(source='corresponding_author.get_full_name', read_only=True)
    volume_number = serializers.IntegerField(source='volume.number', read_only=True)
    issue_number = serializers.IntegerField(source='issue.number', read_only=True)
    keywords_list = serializers.ListField(source='get_keywords_list', read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'abstract', 'keywords', 'keywords_list',
            'category', 'category_name', 'volume', 'volume_number',
            'issue', 'issue_number', 'authors', 'corresponding_author',
            'corresponding_author_name', 'pages', 'doi', 'published_pdf',
            'status', 'published_date', 'views_count', 'downloads_count'
            'created_at', 'updated_at'
        ]

        
    