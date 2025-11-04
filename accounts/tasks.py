from celery import shared_task
from django.utils import timezone
from datetime import time, timedelta
from django.db.models import F
from service.models import ServisKayit
from accounts.models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

# @shared_task
# def check_service_records():
#     # Son 10 gün içinde güncellenmemiş servis kayıtlarını bul
#     threshold_date = timezone.now() - timedelta(days=10)
#     outdated_services = ServisKayit.objects.filter(
#         updated_at__lt=threshold_date,
#         status__in=['beklemede', 'işlemde']  # Sadece aktif durumda olan kayıtlar
#     ).select_related('created_user')

#     for service in outdated_services:
#         # Servisin son güncellemesinden bu yana geçen gün sayısı
#         days_since_update = (timezone.now() - service.updated_at).days
        
#         # Kullanıcıya daha önce bu servis için bildirim gönderilip gönderilmediğini kontrol et
#         existing_notification = Notification.objects.filter(
#             service_record=service,
#             created_at__gte=timezone.now() - timedelta(days=7)  # Son 7 gün içinde
#         ).exists()

#         if not existing_notification:
#             # Bildirim mesajını hazırla
#             if days_since_update >= 30:
#                 notification_type = 'warning'
#                 message = f'Servis kaydınız {days_since_update} gündür güncellenmedi! Acil kontrol gerekiyor.'
#             else:
#                 notification_type = 'reminder'
#                 message = f'Servis kaydınız {days_since_update} gündür güncellenmedi. Lütfen kontrol ediniz.'

#             # Bildirim oluştur
#             Notification.objects.create(
#                 user=service.created_user,
#                 service_record=service,
#                 notification_type=notification_type,
#                 message=message,
#                 overdue_days=days_since_update
#             )

#     return f"Servis kayıtları kontrol edildi: {outdated_services.count()} adet güncellenmemiş kayıt bulundu."



@shared_task
def uzun_suren_islem():
    print("İşlem başladı...")
    time.sleep(5)
    print("İşlem bitti!")
    return "Tamamlandı!"