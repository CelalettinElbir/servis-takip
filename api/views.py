from django.shortcuts import render
# Create your views here.
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserCreateSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# 🔹 Tüm kullanıcıları listele (sadece admin görebilsin)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

# 🔹 Yeni kullanıcı oluştur (register)
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

# 🔹 Giriş yapmış kullanıcı bilgisi
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)