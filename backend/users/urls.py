from django.urls import path
from .views import (
    UserRegistrationView, UserProfileView, ChangePasswordView,
    user_submissions, user_reviews, user_articles
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('my-submissions/', user_submissions, name='user-submissions'),
    path('my-reviews/', user_reviews, name='user-reviews'),
    path('my-articles/', user_articles, name='user-articles'),
]