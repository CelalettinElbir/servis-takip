from django.db import models
from django.contrib.auth import get_user_model
from service.models import ServisKayit  # ServiceRecord modelinin yolu
from django.utils import timezone

# Create your models here.
User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('overdue', 'Overdue Service'),
        ('reminder', 'Service Reminder'),
        ('warning', 'Service Warning'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    service_record = models.ForeignKey(ServisKayit, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    overdue_days = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} - {self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    service_record = models.ForeignKey(ServisKayit, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    overdue_days = models.PositiveIntegerField(default=0)