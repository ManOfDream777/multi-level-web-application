from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CreateUserSerializer


class SignUpView(CreateAPIView):
    serializer_class = CreateUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        refresh.verify()
        refresh.payload.update({
            'email': user.email,
        })
        return Response(status=201, data={
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class TokenVerifyView(APIView):
    permission_classes = (IsAuthenticated,)

    def options(self, request, *args, **kwargs):
        if self.request.user.is_staff:
            role = 'admin'
        else:
            role = 'user'
        return Response(status=200, data={'success': True, 'role': role})
