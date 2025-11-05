from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
    # User routes

    
    # Customer routes
    path('customers/', views.CustomerListCreateView.as_view(), name='customer-list-create'),
    path('customers/<int:pk>/', views.CustomerDetailView.as_view(), name='customer-detail'),
    
    # Brand routes
    path('brands/', views.BrandListView.as_view(), name='brand-list'),
    path('brands/create/', views.BrandCreateView.as_view(), name='brand-create'),
    path('brands/<int:pk>/', views.BrandDetailView.as_view(), name='brand-detail'),
]    
