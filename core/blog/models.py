from django.db import models
from django.urls import reverse
from django.db.models.signals import post_save
from django.dispatch import receiver

from services.consumers_utils import notify_subscribers


class Blog(models.Model):
    title = models.CharField(max_length=128, verbose_name='Title of the blog')
    body = models.TextField(verbose_name='Text of the blog')
    author = models.ForeignKey('myauth.MyUser', on_delete=models.CASCADE, verbose_name='Author', related_name='blogs')
    is_draft = models.BooleanField(default=True, verbose_name='Draft')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creation date')

    class Meta:
        verbose_name = 'Blog'
        verbose_name_plural = 'Blogs'

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('blog:blog_detail', kwargs={'pk': self.pk})


@receiver(post_save, sender=Blog)
def create_evaluation_and_notification(sender, instance, created, **kwargs):
    if created and not instance.is_draft:
        Evaluation.objects.get_or_create(blog=instance)
        BlogNotifications.objects.get_or_create(author=instance.author)
        notify_subscribers(instance)


class Comment(models.Model):
    blog = models.ForeignKey('Blog', on_delete=models.CASCADE, verbose_name='Blog', related_name='comments')
    author = models.ForeignKey('myauth.MyUser', on_delete=models.CASCADE, verbose_name='Author',
                               related_name='comments')
    body = models.TextField(verbose_name='Comment Text')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creation date')

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'

    def __str__(self):
        return f"Comment left by user {self.author.get_full_name() or self.author.email} to blog {self.blog.title}"


class Evaluation(models.Model):
    blog = models.OneToOneField('Blog', on_delete=models.CASCADE, verbose_name='Blog', related_name='evaluation')
    likes = models.IntegerField(verbose_name='Likes', default=0)
    dislikes = models.IntegerField(verbose_name='Dislikes', default=0)

    class Meta:
        verbose_name = 'Evaluation'
        verbose_name_plural = 'Evaluations'

    def __str__(self):
        return f"Blog {self.blog.title} has {self.likes} of likes and {self.dislikes} of dislikes."

    def get_current_user_evaluation(self, request):
        qs = EvaluationByTheUser.objects.filter(author=request.user, evaluation=self)
        if qs.exists():
            return qs.first().state
        return None


class EvaluationByTheUser(models.Model):
    author = models.ForeignKey('myauth.MyUser', on_delete=models.CASCADE, verbose_name='Author of the Evaluation',
                               related_name='evaluation_author')

    evaluation = models.ForeignKey('Evaluation', on_delete=models.CASCADE, verbose_name='Evaluation',
                                   related_name='evaluation_by_user')

    state = models.BooleanField(verbose_name='State of the evaluation', help_text='If True means '
                                                                                  'like. False '
                                                                                  'means dislike.')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creation date')

    class Meta:
        verbose_name = 'Evaluation by the user'
        verbose_name_plural = 'Evaluations by the user'

    def __str__(self):
        return f'{self.author.get_full_name() or self.author.email} reacted on blog {self.evaluation.blog.title}'

    def delete(self, using=None, keep_parents=False):
        evaluation = self.evaluation
        if self.state:
            evaluation.likes -= 1
        else:
            evaluation.dislikes -= 1
        evaluation.save()
        super().delete(using, keep_parents)


@receiver(post_save, sender=EvaluationByTheUser)
def check_current_state(sender, instance, created, **kwargs):
    if created:
        if instance.state:
            instance.evaluation.likes += 1
        else:
            instance.evaluation.dislikes += 1

    else:
        if instance.state:
            instance.evaluation.likes += 1
            instance.evaluation.dislikes -= 1
        else:
            instance.evaluation.dislikes += 1
            instance.evaluation.likes -= 1
    instance.evaluation.save()


class BlogNotifications(models.Model):
    author = models.OneToOneField('myauth.MyUser', on_delete=models.CASCADE, verbose_name='Author',
                                  related_name='author_notifications')
    subscribers = models.ManyToManyField('myauth.MyUser', related_name='users_notifications', blank=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

    def __str__(self):
        return f'Notification for author {self.author.get_full_name() or self.author.email}'
