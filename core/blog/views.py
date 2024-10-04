import datetime
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView

from django.shortcuts import get_object_or_404

from myauth.models import MyUser
from .models import Blog, EvaluationByTheUser, Comment, BlogNotifications
from .permissions import UserIsOwner
from .serializers import BlogSerializer, RetrievedBlogSerializer, EvaluationByTheUserSerializer, CommentSerializer, \
    CreateAuthorSubscriptionSerializer


class MyAbstractBlogViewSet(viewsets.ModelViewSet):
    """ Abstract class for BlogViewSet and AdminBlogViewSet """
    serializer_class = BlogSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        blog = serializer.save(author=self.request.user)
        return Response(status=201, data=self.serializer_class(blog).data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        blog = serializer.save(created_at=datetime.datetime.now())
        return Response(status=200, data=self.serializer_class(blog).data)


class BlogViewSet(MyAbstractBlogViewSet):
    permission_classes = (IsAuthenticated, UserIsOwner)

    def get_queryset(self):
        return self.request.user.blogs.all().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)


class AdminBlogViewSet(MyAbstractBlogViewSet):
    permission_classes = (IsAuthenticated, IsAdminUser)

    def get_queryset(self):
        return Blog.objects.all().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        raise NotImplemented("This method shouldn't be implemented, because creation operation must be done using "
                             "admin panel in my opinion.")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        blog = serializer.save(created_at=datetime.datetime.now(), author=instance.author)
        return Response(status=200, data=self.serializer_class(blog).data)


class AllBlogs(ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Blog.objects.filter(is_draft=False).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_queryset(), many=True)
        return Response(status=200, data=serializer.data)


class RetrieveBlog(RetrieveAPIView):
    serializer_class = RetrievedBlogSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Blog.objects.filter(is_draft=False)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class CreateAuthorSubscription(CreateAPIView):
    serializer_class = CreateAuthorSubscriptionSerializer
    permission_classes = (IsAuthenticated,)
    queryset = BlogNotifications.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        blog = get_object_or_404(Blog, pk=serializer.validated_data['author'])
        blog_notification, created = BlogNotifications.objects.get_or_create(author=blog.author)
        if self.request.user in blog_notification.subscribers.all():
            return Response(status=202, data={"message": "You have already subscribed to this author."})
        blog_notification.subscribers.add(self.request.user)
        blog_notification.save()
        return Response(status=201)


class CreateCommentForBlog(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Comment.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        blog = get_object_or_404(Blog, pk=serializer.validated_data['blog'])
        comment = serializer.save(author=self.request.user, blog=blog)
        return Response(status=201, data=CommentSerializer(comment).data)


class HandleUserEvaluation(CreateAPIView, UpdateAPIView):
    serializer_class = EvaluationByTheUserSerializer
    queryset = EvaluationByTheUser.objects.all()
    permission_classes = (IsAuthenticated,)

    def create_or_update_evaluation(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        blog_id = serializer.validated_data['evaluation']
        blog = get_object_or_404(Blog, pk=blog_id)
        evaluation = blog.evaluation

        user_evaluation, created = EvaluationByTheUser.objects.get_or_create(
            author=self.request.user,
            evaluation=evaluation,
            defaults={'state': serializer.validated_data['state']}
        )
        if not created and user_evaluation.state != serializer.validated_data['state']:
            user_evaluation.state = serializer.validated_data['state']
            user_evaluation.save()
        elif not created:
            return Response(status=202,
                            data={'success': False, 'message': "You already made this evaluation for this blog"})

        return Response(status=200, data={'success': True})

    def create(self, request, *args, **kwargs):
        return self.create_or_update_evaluation(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return self.create_or_update_evaluation(request, *args, **kwargs)
