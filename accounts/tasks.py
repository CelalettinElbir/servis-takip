from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from service.models import ServiceRecord as ServisKayit
from accounts.models import Notification
import time

User = get_user_model()

@shared_task
def uzun_suren_islem():
    print(f"[{timezone.now()}] ✓ Uzun süren işlem başladı")
    time.sleep(2)  # 2 saniye bekle
    print(f"[{timezone.now()}] ✓ Uzun süren işlem tamamlandı")
    return "Başarılı"

@shared_task
def veritabani_temizlik_gorevi():
    print(f"[{timezone.now()}] 🧹 Veritabanı temizliği başladı")
    # Temizlik işlemleriniz
    print(f"[{timezone.now()}] ✓ Temizlik tamamlandı")
    return "Temizlik başarılı"

@shared_task
def gunluk_rapor_gorevi():
    print(f"[{timezone.now()}] 📊 Günlük rapor oluşturuluyor")
    # Rapor işlemleriniz
    print(f"[{timezone.now()}] ✓ Rapor gönderildi")
    return "Rapor başarılı"

@shared_task
def check_service_updates():
    print(f"[{timezone.now()}] 🔍 Servis güncellemelerini kontrol etme görevi başladı")
    
    # Bir hafta önceki tarihi hesapla
    one_week_ago = timezone.now() - timedelta(days=7)
    
    # Tamamlanmamış (teslim edilmemiş) ve bir haftadır güncellenmemiş kayıtları bul
    stale_services = ServisKayit.objects.exclude(
        status=ServisKayit.STATUS_TESLIM_EDILDI
    ).filter(
        updated_at__lt=one_week_ago
    )
    
    if stale_services.exists():
        # Tüm aktif kullanıcıları al
        users = User.objects.filter(is_active=True)
        
        for service in stale_services:
            days_since_update = (timezone.now().date() - service.updated_at.date()).days
            
            for user in users:
                # Her kullanıcı için bildirim oluştur
                Notification.objects.create(
                    user=user,
                    service_record=service,
                    message=f"{service.musteri_adi}'nin {service.marka} {service.model} cihazı {days_since_update} gündür güncellenmedi.",
                    overdue_days=days_since_update
                )
        
        print(f"[{timezone.now()}] ✓ {stale_services.count()} servis kaydı için bildirimler oluşturuldu")
    else:
        print(f"[{timezone.now()}] ✓ Güncellenmesi gereken servis kaydı bulunamadı")
    
    return "Kontrol tamamlandı"