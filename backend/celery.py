import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

# Celery app'i Django settings ile ayarlama
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Periyodik görevleri tanımlama
app.conf.beat_schedule = {
    'check-service-records': {
        'task': 'accounts.tasks.check_service_records',
        'schedule': crontab(hour='9', minute='0'),  # Her gün saat 09:00'da çalışır
    },
}