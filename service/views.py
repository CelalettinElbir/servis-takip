from django.shortcuts import render

# Create your views here.
from rest_framework import generics, viewsets
from .models import ServiceLog, ServiceRecord
from .serializers import ServiceRecordSerializer, ServiceLogSerializer
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
    queryset = ServiceRecord.objects.all()
    serializer_class = ServiceRecordSerializer
    permission_classes = []


class ServiceRecordViewSet(viewsets.ModelViewSet):
    queryset = ServiceRecord.objects.all().order_by('-id')  
    serializer_class = ServiceRecordSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        service_record = self.get_object()
        logs = ServiceLog.objects.filter(service_record=service_record).order_by('-change_date')
        serializer = ServiceLogSerializer(logs, many=True)
        return Response(serializer.data)