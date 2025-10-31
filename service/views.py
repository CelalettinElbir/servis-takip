from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import ServisKayit
from .serializers import ServisKayitSerializer
from rest_framework.permissions import IsAuthenticated

# Tüm kayıtları listele ve yeni kayıt ekle
class KayitListCreateAPIView(generics.ListCreateAPIView):
    queryset = ServisKayit.objects.all().order_by('-id')
    serializer_class = ServisKayitSerializer
    permission_classes = [IsAuthenticated]  # kullanıcı giriş yapmalı

    def perform_create(self, serializer):
        serializer.save(created_user=self.request.user)

# Tekil kayıt: görüntüle, güncelle, sil
class KayitRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServisKayit.objects.all()
    serializer_class = ServisKayitSerializer
    permission_classes = []
