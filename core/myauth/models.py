from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .manager import MyUserManager
from django.db import models


class MyAbstractBaseUser(AbstractUser):
    last_login = None
    username = None
    email = models.EmailField(_("Email адрес"), unique=True)

    objects = MyUserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("Пользователь")
        verbose_name_plural = _("Пользователи")
        abstract = True


class MyUser(MyAbstractBaseUser):

    def __str__(self):
        if self.last_name and self.first_name:
            return f'{self.last_name} {self.first_name}'
        return self.email
