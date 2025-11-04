from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
import json

class ServisKayitLog(models.Model):
    servis_kayit = models.ForeignKey('ServisKayit', on_delete=models.CASCADE, related_name='logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    degisiklik_tarihi = models.DateTimeField(auto_now_add=True)
    # eski_degerler = models.JSONField(null=True)
    # yeni_degerler = models.JSONField()
    changed_fields = models.JSONField(null=True, blank=True)  # Yeni alan
    def __str__(self):
        return f"{self.servis_kayit} - {self.degisiklik_tarihi}"

class ServisKayit(models.Model):
    STATUS_BEKLEMEDE = 'beklemede'
    STATUS_SERVISE_GITTI = 'servise_gitti'
    STATUS_SERVISTEN_GELDI = 'servisten_geldi'
    STATUS_TESLIM_EDILDI = 'teslim_edildi'
    

    STATUS_CHOICES = [
        (STATUS_BEKLEMEDE, 'Beklemede'),
        (STATUS_SERVISE_GITTI, 'Servise Gitti'),
        (STATUS_SERVISTEN_GELDI, 'Servisten Geldi'),
        (STATUS_TESLIM_EDILDI, 'Teslim Edildi'),
    ]
    
    updated_at = models.DateTimeField(auto_now=True)  # Her güncelleme işleminde otomatik güncellenir
    
    musteri_adi = models.CharField(max_length=255)
    marka = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    seri_no = models.CharField(max_length=100, blank=True, null=True)
    aksesuar = models.CharField(max_length=255, blank=True, null=True)
    gelis_tarihi = models.DateField()
    ariza = models.TextField(blank=True, null=True)
    servis_ismi = models.CharField(max_length=255)
    servise_gonderim_tarihi = models.DateField(blank=True, null=True)
    yapilan_islem = models.TextField(blank=True, null=True)
    servisten_gelis_tarihi = models.DateField(blank=True, null=True)
    teslim_tarihi = models.DateField(blank=True, null=True)
    created_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='servis_kayitlari')
    status = models.CharField(max_length=50, default='Beklemede')

    def __str__(self):
        return f"{self.musteri_adi} - {self.marka} {self.model}"

