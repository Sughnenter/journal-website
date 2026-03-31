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

class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.IntegerField(source='articles.count', read_only=True)

    class Meta:
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
    volume_number = serializers.IntegerField(source='volume.number', read_only=True)
    issue_number  = serializers.IntegerField(source='issue.number', read_only=True)
    keywords_list = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'abstract', 'keywords', 'keywords_list',
            'category', 'category_name', 'authors',
            'volume', 'volume_number', 'issue', 'issue_number',
            'pages', 'doi', 'published_pdf',
            'published_date', 'views_count', 'downloads_count', 'status'
        ]

    def get_authors(self, obj):
        author_articles = obj.authorarticle_set.all().order_by('order')
        return [
            {
                'author_name': aa.author.get_full_name() or aa.author.username,
                'author_affiliation': getattr(aa, 'affiliation', ''),
                'is_corresponding': obj.corresponding_author_id == aa.author_id,
            }
            for aa in author_articles
        ]

    def get_keywords_list(self, obj):
        return obj.get_keywords_list()

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

        
class SubmissionSerializer(serializers.ModelSerializer):
    submitter_name = serializers.CharField(source='submitter.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Submission
        fields = [
            'id', 'title', 'abstract', 'keywords', 'category', 'category_name',
            'submitter', 'submitter_name', 'co_authors', 'manuscript_file',
            'cover_letter', 'status', 'submitted_at', 'updated_at'
        ]
        read_only_fields = ['submitter', 'status', 'submitted_at', 'updated_at']

    def create(self, validated_data):
        # Automatically Set Submitter to Current User
        validated_data['submitter'] = self.context['request'].user
        return super().create(validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    article_title = serializers.CharField(source='article.title', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'article', 'article_title', 'reviewer', 'reviewer_name',
            'comments_to_author', 'comments_to_editor', 'recommendation',
            'status', 'originality', 'methodology', 'significance', 'clarity',
            'invited_at', 'completed_at'
        ]
        read_only_fields = ['invited_at', 'completed_at']

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'article', 'user', 'user_name', 'content',
                    'is_approved', 'created_at', 'updated_at']
        read_only_fields = ['user', 'is_approved', 'created_at', 'updated_at']

    def create (self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)