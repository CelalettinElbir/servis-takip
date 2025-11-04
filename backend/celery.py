import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Periyodik görevler
app.conf.beat_schedule = {
    'test-her-30-saniye': {
        'task': 'accounts.tasks.uzun_suren_islem',
        'schedule': 30.0,
    },
    'temizlik-gece-3te': {
        'task': 'accounts.tasks.veritabani_temizlik_gorevi',
        'schedule': crontab(hour=3, minute=0),
    },
    'servis-guncelleme-kontrolu': {
        'task': 'accounts.tasks.check_service_updates',
        'schedule': crontab(hour=9, minute=0),  # Her gün sabah 9'da çalışacak
    },
    'rapor-sabah-9da': {
        'task': 'accounts.tasks.gunluk_rapor_gorevi',
        'schedule': crontab(hour=9, minute=0),
    },
}

app.conf.timezone = 'Europe/Istanbul'