from django.urls import path
from .views import KayitListCreateAPIView, KayitRetrieveUpdateDestroyAPIView

urlpatterns = [
    # Listeleme ve yeni kayıt ekleme
    path('Services/', KayitListCreateAPIView.as_view(), name='kayit-list-create'),
    
    # Tekil kayıt işlemleri (GET, PUT, PATCH, DELETE)
    path('Services/<int:pk>/', KayitRetrieveUpdateDestroyAPIView.as_view(), name='kayit-detail'),
]
