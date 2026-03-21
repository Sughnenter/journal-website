from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from journal.models import Submission, Review, Article
from journal.serializers import ReviewSerializer, SubmissionSerializer, ArticleListSerializer
from .serializers import (
    UserRegistrationSerializer, UserProfileSerializer, ChangePasswordSerializer
)

User = get_user_model()

# Create your views here.

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'message': 'User registered successfully. Please verify your email.'
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user =  self.get_object()
        serializer =  self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not user.check_password(serializer.data.get('old_password')):
                return Response(
                    {'old_password' : ['Wrong password.']},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Set new password
            user.set_password(serializer.data.get('new_password'))
            user.save()

            return response({
                'message': 'Password Changed Succesfully'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_submissions(request):
    submissions = Submission.objects.filter(submitter=request.user)
    serializer = SubmissionSerializer(submissions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_reviews(request):
    reviews = Review.objects.filter(reviewer=request.user)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_articles(request):
    articles = Article.objects.filter(authors=request.user)
    serializer = ArticleListSerializer(articles, many=True)
    return Response(serializer.data)
    