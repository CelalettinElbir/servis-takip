from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import ServisKayit
from .serializers import ServisKayitSerializer

# Tüm kayıtları listele ve yeni kayıt ekle
class KayitListCreateAPIView(generics.ListCreateAPIView):
    queryset = ServisKayit.objects.all().order_by('-gelis_tarihi')
    serializer_class = ServisKayitSerializer

# Tekil kayıt: görüntüle, güncelle, sil
class KayitRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServisKayit.objects.all()
    serializer_class = ServisKayitSerializer
