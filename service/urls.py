from django.urls import path
from .views import KayitRetrieveUpdateDestroyAPIView, ServiceRecordViewSet, ServiceViewSet

urlpatterns = [
    # Servis Kayıtları
    path('Services/', ServiceRecordViewSet.as_view({'get': 'list', 'post': 'create'}), name='kayit-list-create'),
    path('Services/dashboard_stats/', ServiceRecordViewSet.as_view({'get': 'dashboard_stats'}), name='dashboard-stats'),
    path('Services/<int:pk>/', ServiceRecordViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='kayit-detail'),
    
    # Servis Firmaları
    path('ServiceCompanies/', ServiceViewSet.as_view({'get': 'list', 'post': 'create'}), name='service-list-create'),
    path('ServiceCompanies/<int:pk>/', ServiceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='service-detail'),
]
