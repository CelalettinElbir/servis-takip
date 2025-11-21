from rest_framework import serializers
import datetime

from api.serializers import BrandSerializer, CustomerSerializer
from .models import ServiceLog, ServiceRecord, Service
from api.models import Brand, Customer


# --- SERVICE SERIALIZER ---
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'address', 'phone', 'email', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        ref_name = "ServiceSerializer"


# --- LOG SERIALIZER ---
class ServiceLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # kullanıcı adını göstermek için

    class Meta:
        model = ServiceLog
        fields = ['id', 'user', 'change_date', 'changed_fields']
        ref_name = "ServiceLogSerializer"


# --- SERVICE RECORD SERIALIZER ---
class ServiceRecordSerializer(serializers.ModelSerializer):
    # Her servis kaydının loglarını dahil et
    logs = serializers.SerializerMethodField()
    customer = CustomerSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source='customer',
        write_only=True
    )
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(),
        source='brand',
        write_only=True
    )
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True
    )
    class Meta:
        model = ServiceRecord
        ref_name = "ServiceRecordSerializer"
        fields = [
            'id',
            'brand_id', 'customer_id', 'service_id',
            'customer',                 # müşteri
            'brand',                    # marka
            'service',                  # servis
            'model',                    # model
            'serial_number',            # seri_no
            'accessories',              # aksesuar
            'arrival_date',             # gelis_tarihi
            'issue',                    # ariza
            'service_send_date',        # servise_gonderim_tarihi
            'service_operation',        # yapilan_islem
            'service_return_date',      # servisten_gelis_tarihi
            'delivery_date',            # teslim_tarihi
            'created_user',             # kaydı oluşturan kullanıcı
            'status',                   # durum
            'updated_at',               # güncellenme tarihi
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

                # Eğer ManyToOne (ForeignKey) ise sadece id veya str(value) al
                if hasattr(value, "id"):
                    value = value.id  # veya str(value) istersen ismi alabilirsin
                
                # Tarihleri string formatına çevir
                if isinstance(value, (datetime.date, datetime.datetime)):
                    value = value.isoformat()
                
                changed_fields[field.name] = value


            # Log kaydı oluştur
            ServiceLog.objects.create(
                service_record=instance,
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
            eski_degerler = {}
            for field in instance._meta.fields:
                field_name = field.name
                old_value = getattr(instance, field_name)
                
                # ForeignKey için obje referansını sakla
                if hasattr(old_value, 'pk') and old_value is not None:
                    eski_degerler[field_name] = {
                        'id': old_value.pk,
                        'str': str(old_value)
                    }
                else:
                    eski_degerler[field_name] = old_value

            # Otomatik durum güncellemesi
            servise_gonderim_tarihi = validated_data.get("service_send_date")
            servisten_gelis_tarihi = validated_data.get("service_return_date")
            teslim_tarihi = validated_data.get("delivery_date")

            if teslim_tarihi:
                validated_data["status"] = ServiceRecord.STATUS_DELIVERED
            elif servisten_gelis_tarihi:
                validated_data["status"] = ServiceRecord.STATUS_RETURNED_FROM_SERVICE
            elif servise_gonderim_tarihi:
                validated_data["status"] = ServiceRecord.STATUS_SENT_TO_SERVICE
            else:
                validated_data["status"] = ServiceRecord.STATUS_PENDING

            # Güncelle
            instance = super().update(instance, validated_data)

            # Değişen alanları bul
            changed_fields = {}
            for field in instance._meta.fields:
                field_name = field.name
                old_value = eski_degerler.get(field_name)
                new_value = getattr(instance, field_name)

                # ForeignKey kontrolü (customer, brand gibi)
                if hasattr(new_value, 'pk'):
                    old_val = old_value if old_value else None
                    new_val = {'id': new_value.pk, 'str': str(new_value)} if new_value else None
                    
                    # Karşılaştırma için ID'leri kullan
                    old_id = old_val['id'] if old_val and isinstance(old_val, dict) else None
                    new_id = new_val['id'] if new_val else None
                    
                    if old_id != new_id:
                        changed_fields[field_name] = {
                            'old': old_val,
                            'new': new_val
                        }
                else:
                    # Tarihleri string formatına çevir
                    old_val = old_value
                    new_val = new_value
                    
                    if isinstance(old_val, (datetime.date, datetime.datetime)):
                        old_val = old_val.isoformat()
                    if isinstance(new_val, (datetime.date, datetime.datetime)):
                        new_val = new_val.isoformat()

                    if old_val != new_val:
                        changed_fields[field_name] = {
                            'old': old_val,
                            'new': new_val
                        }

            # Sadece değişiklik varsa log kaydet
            if changed_fields:
                ServiceLog.objects.create(
                    service_record=instance,
                    user=user,
                    changed_fields=changed_fields
                )

            return instance

        except Exception as e:
            print(f"Hata oluştu: {str(e)}")
            raise serializers.ValidationError({"error": "Kayıt güncellenirken bir hata oluştu."})


    def get_logs(self, obj):
        logs = obj.logs.order_by('-id')  # id'ye göre ters
        return ServiceLogSerializer(logs, many=True).data