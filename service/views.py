from django.shortcuts import render

# Create your views here.
from rest_framework import generics, viewsets
from .models import ServiceLog, ServiceRecord, Service
from .serializers import ServiceRecordSerializer, ServiceLogSerializer, ServiceSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from collections import defaultdict

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

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Dashboard için servis kayıt istatistikleri"""
        
        # Durum bazında sayılar
        status_counts = ServiceRecord.objects.values('status').annotate(count=Count('id'))
        
        # Toplam kayıt sayısı
        total_records = ServiceRecord.objects.count()
        
        # Bu ay eklenen kayıtlar
        from datetime import datetime, timedelta
        current_month = datetime.now().month
        current_year = datetime.now().year
        monthly_records = ServiceRecord.objects.filter(
            arrival_date__month=current_month,
            arrival_date__year=current_year
        ).count()
        
        # Son 7 gün eklenen kayıtlar
        seven_days_ago = datetime.now() - timedelta(days=7)
        weekly_records = ServiceRecord.objects.filter(
            arrival_date__gte=seven_days_ago.date()
        ).count()
        
        # Serviste olanlar (servise gitti ama henüz dönmedi)
        in_service_count = ServiceRecord.objects.filter(
            Q(status=ServiceRecord.STATUS_SENT_TO_SERVICE) | Q(status='sent_to_service')
        ).count()
        
        # Teslim bekleyenler (servisten geldi ama henüz teslim edilmedi)
        waiting_delivery_count = ServiceRecord.objects.filter(
            Q(status=ServiceRecord.STATUS_RETURNED_FROM_SERVICE) | Q(status='returned_from_service')
        ).count()
        
        # Beklemede olanlar
        pending_count = ServiceRecord.objects.filter(
            Q(status=ServiceRecord.STATUS_PENDING) | Q(status='pending') | Q(status='Pending')
        ).count()
        
        # Teslim edilenler
        delivered_count = ServiceRecord.objects.filter(
            Q(status=ServiceRecord.STATUS_DELIVERED) | Q(status='delivered')
        ).count()
        
        # Marka bazında sayılar (en çok servis verilen markalar)
        brand_counts = ServiceRecord.objects.values(
            'brand__name'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5]  # Top 5 marka
        
        data = {
            'total_records': total_records,
            'monthly_records': monthly_records,
            'weekly_records': weekly_records,
            'status_summary': {
                'pending': pending_count,
                'in_service': in_service_count,
                'waiting_delivery': waiting_delivery_count,
                'delivered': delivered_count
            },
            'status_counts': list(status_counts),
            'top_brands': list(brand_counts)
        }
        
        return Response(data)


class ServiceViewSet(viewsets.ModelViewSet):
    """Servis firmaları için ViewSet"""
    queryset = Service.objects.all().order_by('name')
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]