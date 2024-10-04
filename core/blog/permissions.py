from rest_framework.permissions import BasePermission


class UserIsOwner(BasePermission):
    def has_object_permission(self, request, view, blog):

        return blog.author == request.user
