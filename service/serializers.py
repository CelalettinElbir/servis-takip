from rest_framework import serializers
from .models import ServisKayit

class ServisKayitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServisKayit
        fields = '__all__'
