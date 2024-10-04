from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def send_blog_notification(author_id, notification_message):
    group_name = f'author_{author_id}_notifications'

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_notification',
            'message': notification_message,
        }
    )


def notify_subscribers(blog):
    notification_instance = blog.author.author_notifications
    subscribers = notification_instance.subscribers.all()
    if subscribers.exists():
        author = blog.author.get_full_name() or blog.author.email
        send_blog_notification(blog.author.id, {'message': f'Author - '
                                                           f'{author} '
                                                           f'has published new blog - {blog.title}! Read it now.',
                                                'url': blog.get_absolute_url()})
