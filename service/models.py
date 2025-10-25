from django.db import models

# Create your models here.

from django.db import models

class ServisKayit(models.Model):
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

    def __str__(self):
        return f"{self.musteri_adi} - {self.marka} {self.model}"
