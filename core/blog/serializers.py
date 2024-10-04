from rest_framework import serializers
from .models import Blog, Evaluation, Comment, EvaluationByTheUser, BlogNotifications
from lxml.html.clean import Cleaner


class BlogSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, format='%d.%m.%Y %H:%M:%S')
    revert_url = serializers.CharField(read_only=True, source='get_absolute_url')

    class Meta:
        model = Blog
        fields = '__all__'

    def validate(self, attrs: dict):
        cleaner = Cleaner(scripts=True, javascript=True, comments=True, style=False, links=True, meta=True,
                          page_structure=False, safe_attrs_only=False)
        attrs['body'] = cleaner.clean_html(attrs['body'])
        return super().validate(attrs)


class EvaluationSerializer(serializers.ModelSerializer):
    current_user_evaluation = serializers.BooleanField(read_only=True, allow_null=True, )

    class Meta:
        model = Evaluation
        fields = ('likes', 'dislikes', 'current_user_evaluation')

    def to_representation(self, instance):
        output = {
            'likes': instance.likes,
            'dislikes': instance.dislikes,
            'current_user_evaluation': instance.get_current_user_evaluation(request=self.context.get('request'))
        }
        return output


class CommentSerializer(serializers.ModelSerializer):
    blog_id = serializers.IntegerField(source='blog', write_only=True)
    author = serializers.StringRelatedField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, format='%d.%m.%Y %H:%M:%S')

    class Meta:
        model = Comment
        fields = ('author', 'body', 'created_at', 'blog_id')


class SubscriptionStatusSerializer(serializers.ModelSerializer):
    is_subscribed = serializers.BooleanField(read_only=True)

    class Meta:
        model = BlogNotifications
        fields = ('is_subscribed',)

    def to_representation(self, instance):
        request = self.context['request']
        try:
            if request.user in instance.author.author_notifications.subscribers.all():
                return {'is_subscribed': True}
            return {'is_subscribed': False}
        except BlogNotifications.DoesNotExist:
            return {'is_subscribed': None}


class RetrievedBlogSerializer(serializers.ModelSerializer):
    likes_data = EvaluationSerializer(source='evaluation')
    comments_data = serializers.SerializerMethodField(source='comments')
    subscription_status = serializers.SerializerMethodField(source='get_subscription_status')
    author = serializers.StringRelatedField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, format='%d.%m.%Y %H:%M:%S')

    class Meta:
        model = Blog
        fields = ('id', 'title', 'body', 'author', 'is_draft', 'created_at', 'likes_data', 'comments_data',
                  'subscription_status')

    def get_comments_data(self, instance):
        return CommentSerializer(instance.comments.all().order_by('-created_at'), many=True).data

    def get_subscription_status(self, instance):
        return SubscriptionStatusSerializer(instance, context=self.context).data


class EvaluationByTheUserSerializer(serializers.ModelSerializer):
    blog_id = serializers.IntegerField(source='evaluation')  # frontend will send blog_id instead of evaluation_id

    class Meta:
        model = EvaluationByTheUser
        fields = ('state', 'blog_id')


class CreateAuthorSubscriptionSerializer(serializers.ModelSerializer):
    blog_id = serializers.IntegerField(source='author', write_only=True)

    class Meta:
        model = BlogNotifications
        fields = ('blog_id',)
