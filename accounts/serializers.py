from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Notification
from service.serializers import ServiceRecordSerializer

# Kullanıcı kayıt serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)  # password confirmation

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
        ref_name = "AccountsRegisterSerializer"

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Parolalar eşleşmiyor"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']
        ref_name = "AccountsUserSerializer"


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        ref_name = "AccountsUserCreateSerializer"

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user


class NotificationSerializer(serializers.ModelSerializer):
    service_record = ServiceRecordSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'service_record', 'message', 
                 'created_at', 'is_read', 'overdue_days']
        read_only_fields = ['created_at']
        ref_name = "AccountsNotificationSerializer"