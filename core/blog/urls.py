from .views import (BlogViewSet, AllBlogs, AdminBlogViewSet, RetrieveBlog, HandleUserEvaluation, CreateCommentForBlog,
                    CreateAuthorSubscription)
from django.urls import path

app_name = 'blog'

urlpatterns = [
    path('blog/', BlogViewSet.as_view({'get': 'list'})),
    path('blog/create/', BlogViewSet.as_view({'post': 'create'})),
    path('blog/<int:pk>', RetrieveBlog.as_view(), name='blog_detail'),
    path('blog/<int:pk>/subscribe/', CreateAuthorSubscription.as_view(), name='create_author_subscription'),
    path('blog/<int:pk>/evaluate/', HandleUserEvaluation.as_view(), name='blog_evaluation'),
    path('blog/<int:pk>/create_comment/', CreateCommentForBlog.as_view(), name='create_comment'),
    path('blog/<int:pk>/delete/', BlogViewSet.as_view({'delete': 'destroy'})),
    path('blog/<int:pk>/update/', BlogViewSet.as_view({'put': 'update'})),

    path('api/admin/blog/<int:pk>/update/', AdminBlogViewSet.as_view({'put': 'update'})),
    path('api/admin/blog/<int:pk>/delete/', AdminBlogViewSet.as_view({'delete': 'destroy'})),

    path('news/', AllBlogs.as_view(), name='all_blogs'),
]
