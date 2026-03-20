from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, VolumeViewSet, IssueViewSet, ArticleViewSet, 
    SubmissionViewSet, ReviewViewSet, CommentViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'volumes', VolumeViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'submissions', SubmissionViewSet, basename='submission')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
