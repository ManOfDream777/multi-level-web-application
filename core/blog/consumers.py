import json
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from myauth.models import MyUser
from blog.models import BlogNotifications
from services.consumers_utils import send_blog_notification


class AsyncNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def send_notification(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def disconnect(self, close_code):
        for group_name in self.groups:
            await self.channel_layer.group_discard(
                group_name,
                self.channel_name
            )

    async def receive(self, text_data=None, bytes_data=None):
        # It's better to perform redis in this project to store and send previous notifications on refresh. For
        # example, notifications can be stored 30 days in redis and until this time runs out they will be sent to
        # client. Reason why I don't want to use Redis in my test projects - I don't want to clutter my Mac.
        try:
            token = json.loads(text_data)['token']
            user_id = AccessToken(token)['user_id']
            user = await self.get_user(user_id=user_id)
        except TokenError:
            await self.close()
            await self.disconnect(close_code=4001)
            return

        author_ids = await self.get_subscription_author_ids(user)

        self.groups = []

        for author_id in author_ids:
            group_name = f'author_{author_id}_notifications'

            await self.channel_layer.group_add(
                group_name,
                self.channel_name
            )

            self.groups.append(group_name)

        await self.find_recent_notifications(user)

    @database_sync_to_async
    def get_user(self, user_id):
        return MyUser.objects.filter(id=user_id).first()

    @database_sync_to_async
    def get_subscription_author_ids(self, user):
        return list(BlogNotifications.objects.filter(subscribers=user).values_list('author__id', flat=True))

    @database_sync_to_async
    def find_recent_notifications(self, user):
        user_subscriptions = BlogNotifications.objects.filter(subscribers=user).select_related(
            'author').prefetch_related('author__blogs')
        if user_subscriptions.exists():
            for subscription in user_subscriptions:
                author = subscription.author
                author_name = author.get_full_name() or author.email
                blogs = author.blogs.filter(is_draft=False, created_at__gte=timezone.now() - timezone.timedelta(days=1))
                for recent_blog in blogs:
                    send_blog_notification(recent_blog.author.id, {'message': f'Read recent blog of'
                                                                              f' {author_name} '
                                                                              f'named {recent_blog.title}. '
                                                                              f'Click this box to read it now!',
                                                                   'url': recent_blog.get_absolute_url(),
                                                                   'blog_id': recent_blog.id
                                                                   })
