from rest_framework import serializers
import datetime
from .models import ServisKayit, ServisKayitLog


# --- LOG SERIALIZER ---
class ServisKayitLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # kullanıcı adını göstermek için

    class Meta:
        model = ServisKayitLog
        fields = ['id', 'user', 'degisiklik_tarihi', 'changed_fields']


# --- SERVIS KAYIT SERIALIZER ---
class ServisKayitSerializer(serializers.ModelSerializer):
    # Her servis kaydının loglarını dahil et
    logs = serializers.SerializerMethodField()

    class Meta:
        model = ServisKayit
        fields = [
            'id',
            'musteri_adi',
            'marka',
            'model',
            'seri_no',
            'aksesuar',
            'gelis_tarihi',
            'ariza',
            'servis_ismi',
            'servise_gonderim_tarihi',
            'yapilan_islem',
            'servisten_gelis_tarihi',
            'teslim_tarihi',
            'created_user',
            'status',
            'logs',  # 🔹 Loglar burada eklendi
        ]


    def create(self, validated_data):
        try:
            user = self.context['request'].user
            instance = super().create(validated_data)

            # Tarihleri JSON formatına dönüştür
            changed_fields = {}
            for field in instance._meta.fields:
                if field.name == "id":
                    continue
                value = getattr(instance, field.name)
                if isinstance(value, (datetime.date, datetime.datetime)):
                    value = value.isoformat()
                changed_fields[field.name] = value

            # Log kaydı oluştur
            ServisKayitLog.objects.create(
                servis_kayit=instance,
                user=user,
                changed_fields=changed_fields
            )

            return instance

        except Exception as e:
            print(f"Hata oluştu: {str(e)}")
            raise serializers.ValidationError({"error": "Kayıt oluşturulurken bir hata oluştu."})


    def update(self, instance, validated_data):
        try:
            user = self.context['request'].user

            # Güncelleme öncesi eski değerleri al
            eski_degerler = {field.name: getattr(instance, field.name) for field in instance._meta.fields}

            # Otomatik durum güncellemesi
            servise_gonderim_tarihi = validated_data.get("servise_gonderim_tarihi")
            servisten_gelis_tarihi = validated_data.get("servisten_gelis_tarihi")
            teslim_tarihi = validated_data.get("teslim_tarihi")

            if teslim_tarihi:
                validated_data["status"] = ServisKayit.STATUS_TESLIM_EDILDI
            elif servisten_gelis_tarihi:
                validated_data["status"] = ServisKayit.STATUS_SERVISTEN_GELDI
            elif servise_gonderim_tarihi:
                validated_data["status"] = ServisKayit.STATUS_SERVISE_GITTI
            else:
                validated_data["status"] = ServisKayit.STATUS_BEKLEMEDE

            # Güncelle
            instance = super().update(instance, validated_data)

            # Değişen alanları bul
            changed_fields = {}
            for field in instance._meta.fields:
                field_name = field.name
                old_value = eski_degerler.get(field_name)
                new_value = getattr(instance, field_name)

                # Tarihleri string formatına çevir
                if isinstance(old_value, (datetime.date, datetime.datetime)):
                    old_value = old_value.isoformat()
                if isinstance(new_value, (datetime.date, datetime.datetime)):
                    new_value = new_value.isoformat()

                if old_value != new_value:
                    changed_fields[field_name] = new_value

            # Sadece değişiklik varsa log kaydet
            if changed_fields:
                ServisKayitLog.objects.create(
                    servis_kayit=instance,
                    user=user,
                    changed_fields=changed_fields
                )

            return instance

        except Exception as e:
            print(f"Hata oluştu: {str(e)}")
            raise serializers.ValidationError({"error": "Kayıt güncellenirken bir hata oluştu."})


    def get_logs(self, obj):
        logs = obj.logs.order_by('-id')  # id'ye göre ters
        return ServisKayitLogSerializer(logs, many=True).data