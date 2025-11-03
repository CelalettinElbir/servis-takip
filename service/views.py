from django.shortcuts import render

# Create your views here.
from rest_framework import generics, viewsets
from .models import ServisKayit, ServisKayitLog
from .serializers import ServisKayitSerializer, ServisKayitLogSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

# Tüm kayıtları listele ve yeni kayıt ekle
# class KayitListCreateAPIView(generics.ListCreateAPIView):
#     queryset = ServisKayit.objects.all().order_by('-id')
#     serializer_class = ServisKayitSerializer
#     permission_classes = [IsAuthenticated]  # kullanıcı giriş yapmalı

#     def perform_create(self, serializer):
#         serializer.save(created_user=self.request.user)

# Tekil kayıt: görüntüle, güncelle, sil
class KayitRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServisKayit.objects.all()
    serializer_class = ServisKayitSerializer
    permission_classes = []




class ServisKayitViewSet(viewsets.ModelViewSet):
    queryset = ServisKayit.objects.all()
    serializer_class = ServisKayitSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        servis_kayit = self.get_object()
        logs = ServisKayitLog.objects.filter(servis_kayit=servis_kayit).order_by('-degisiklik_tarihi')
        serializer = ServisKayitLogSerializer(logs, many=True)
        return Response(serializer.data)