from rest_framework import serializers

from myauth.models import MyUser


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(label='Пароль', style={'input_type': 'password'})
    password2 = serializers.CharField(label='Подтверждение пароля', style={'input_type': 'password'})

    class Meta:
        model = MyUser
        fields = ('email', 'password', 'password2')

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Passwords aren't match")
        return {'email': attrs.get('email'), 'password': password}

    def save(self, **kwargs):
        user_data = self.validated_data
        return MyUser.objects.create_user(**user_data)
