from django.urls import path
from .views import  KayitRetrieveUpdateDestroyAPIView,ServisKayitViewSet

urlpatterns = [
    # Listeleme ve yeni kayıt ekleme
    path('Services/', ServisKayitViewSet.as_view({'get': 'list', 'post': 'create'}), name='kayit-list-create'),
    
    # Tekil kayıt işlemleri (GET, PUT, PATCH, DELETE)
    path('Services/<int:pk>/', ServisKayitViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='kayit-detail'),
]
