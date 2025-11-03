from django.db import models
from django.db import models
from django.contrib.auth import get_user_model
from service.models import ServisKayit  # ServiceRecord modelinin yolu
# Create your models here.
User = get_user_model()

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    service_record = models.ForeignKey(ServisKayit, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    overdue_days = models.PositiveIntegerField(default=0)