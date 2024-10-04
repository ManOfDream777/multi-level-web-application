from django.contrib import admin

from blog.models import Blog, Comment, Evaluation, EvaluationByTheUser, BlogNotifications

admin.site.register(Blog)
admin.site.register(Evaluation)
admin.site.register(Comment)
admin.site.register(EvaluationByTheUser)
admin.site.register(BlogNotifications)
