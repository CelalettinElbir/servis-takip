from django.contrib import admin
from .models import ServiceRecord, ServiceLog, Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'phone', 'email']
    ordering = ['name']

@admin.register(ServiceRecord)
class ServiceRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'brand', 'model', 'service', 'status', 'arrival_date']
    list_filter = ['status', 'brand', 'service', 'arrival_date']
    search_fields = ['model', 'serial_number', 'customer__company_name']
    ordering = ['-arrival_date']

admin.site.register(ServiceLog)