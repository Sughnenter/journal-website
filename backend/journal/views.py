from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone

from .models import (
    Category, Volume, Issue, Article, Submission, Review, Comment
)

from .serializers import (
    CategorySerializer, VolumeSerializer, IssueSerializer,
    ArticleListSerializer, ArticleDetailSerializer,
    SubmissionSerializer, ReviewSerializer, CommentSerializer
)


# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class VolumeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Volume.objects.all()
    serializer_class = VolumeSerializer

    @action(detail=True, methods=['get'])
    def issues(self, request, pk=None):
        volume = self.get_object()
        issues = volume.issues.all()
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data)


class IssueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    @action(detail=True, methods=['get'])
    def articles(self, request, pk=None):
        issue = self.get_object()
        articles = issue.articles.filter(status='published')
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(status='published')
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'volume', 'issue']
    search_fields = ['title', 'abstract', 'keywords']
    ordering_fields = ['published_date', 'views_count', 'downloads_count']
    ordering = ['published_date']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleListSerializer
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def download(self, request, slug=None):
        article = self.get_object()
        article.downloads_count += 1
        article.save(update_fields=['downloads_count'])
        return Response({'message':'Download tracked'})

    @action(detail=False, methods=['get'])
    def latest(self, request):
        count = int(request.query_params.get('count', 10))
        articles = self.get_queryset()[:count]
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])

        articles = self.get_queryset().filter(
            Q(title__icontains=query) |
            Q(abstract__icontains=query) |
            Q(keywords__icontains=query) |
            Q(authorarticle__author__first_name__icontains=query) |
            Q(authorarticle__author__last_name__icontains=query)    
        ).distinct()

        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)


class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user =  self.request.user
        if user.is_staff or user.is_editor:
            return Submission.objects.all()
        else:
            return Submission.objects.filter(submitter=user)

    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user)

    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """Withdraw a submission"""
        submission = self.get_object()
        if submission.submitter != request.user:
            return Response(
                {'error': 'You can only withdraw your own submissions'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        submission.status = 'withdrawn'
        submission.save()
        return Response({'message': 'Submission withdrawn successfully'})


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_editor:
            return Review.objects.all()
        return Review.objects.filter(reviewer=user)

    @action(detail=True, methods=['post'])
    def submit_review(self, request, pk=None):
        

        review = self.get_object()
        if review.reviewer != request.user:
            return Response(
                {'error':'You can only submit your own reviews'},
                status=status.HTTP_403_FORBIDDEN
            )

        review.status = 'completed'
        review.completed_at = timezone.now()
        review.save()

        return Response({'message': 'Review Submitted successfully'})

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Comment.objects.all()
        return Comment.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        