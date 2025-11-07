from django.contrib import admin
from .models import ServiceRecord, ServiceLog
# Register your models here.

admin.site.register(ServiceRecord)  # Add your models inside the parentheses
admin.site.register(ServiceLog)  # Add your models inside the parentheses