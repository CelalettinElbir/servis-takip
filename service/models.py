from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
import json
from api.models import Customer, Brand


class Service(models.Model):
    """Servis firması/adı modeli"""
    name = models.CharField(max_length=255, unique=True, verbose_name="Servis Adı")
    description = models.TextField(blank=True, null=True, verbose_name="Açıklama")
    address = models.TextField(blank=True, null=True, verbose_name="Adres")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefon")
    email = models.EmailField(blank=True, null=True, verbose_name="E-posta")
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Servis"
        verbose_name_plural = "Servisler"
        ordering = ['name']

    def __str__(self):
        return self.name
class ServiceLog(models.Model):
    service_record = models.ForeignKey('ServiceRecord', on_delete=models.CASCADE, related_name='logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    change_date = models.DateTimeField(auto_now_add=True)
    changed_fields = models.JSONField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.service_record} - {self.change_date}"

class ServiceRecord(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_SENT_TO_SERVICE = 'sent_to_service'
    STATUS_RETURNED_FROM_SERVICE = 'returned_from_service'
    STATUS_DELIVERED = 'delivered'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_SENT_TO_SERVICE, 'Sent to Service'),
        (STATUS_RETURNED_FROM_SERVICE, 'Returned from Service'),
        (STATUS_DELIVERED, 'Delivered'),
    ]
    
    updated_at = models.DateTimeField(auto_now=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True, blank=True)
    model = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    accessories = models.CharField(max_length=255, blank=True, null=True)
    arrival_date = models.DateField()
    issue = models.TextField(blank=True, null=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Servis")
    service_send_date = models.DateField(blank=True, null=True)
    service_operation = models.TextField(blank=True, null=True)
    service_return_date = models.DateField(blank=True, null=True)
    delivery_date = models.DateField(blank=True, null=True)
    created_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='service_records')
    status = models.CharField(max_length=50, default='Pending')

    def __str__(self):
        return f"{self.customer} - {self.brand} {self.model}"

