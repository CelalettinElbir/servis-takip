#!/usr/bin/env python
"""
Örnek servis firmaları oluşturmak için script
"""
import os
import django

# Django ayarlarını yükle
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from service.models import Service

def create_sample_services():
    """Örnek servis firmaları oluştur"""
    
    sample_services = [
        {
            'name': 'Teknik Servis A.Ş.',
            'description': 'Elektronik cihaz tamir ve bakım hizmetleri',
            'address': 'İstanbul, Türkiye',
            'phone': '0212 555 01 01',
            'email': 'info@teknikservis.com'
        },
        {
            'name': 'Hızlı Tamir Merkezi',
            'description': 'Hızlı ve güvenilir tamir hizmetleri',
            'address': 'Ankara, Türkiye',
            'phone': '0312 555 02 02',
            'email': 'destek@hizlitamir.com'
        },
        {
            'name': 'Profesyonel Servis Ltd.',
            'description': 'Endüstriyel cihaz bakım ve onarım',
            'address': 'İzmir, Türkiye',
            'phone': '0232 555 03 03',
            'email': 'info@profesyonelservis.com'
        },
        {
            'name': 'Uzman Teknisyen',
            'description': 'Uzman teknisyen hizmetleri',
            'address': 'Bursa, Türkiye',
            'phone': '0224 555 04 04',
            'email': 'iletisim@uzmanteknisyen.com'
        },
        {
            'name': 'Güvenilir Servis',
            'description': 'Güvenilir ve kaliteli servis hizmetleri',
            'address': 'Antalya, Türkiye',
            'phone': '0242 555 05 05',
            'email': 'info@guvenilirservis.com'
        }
    ]
    
    for service_data in sample_services:
        service, created = Service.objects.get_or_create(
            name=service_data['name'],
            defaults=service_data
        )
        
        if created:
            print(f"✓ {service.name} oluşturuldu")
        else:
            print(f"- {service.name} zaten mevcut")

if __name__ == '__main__':
    print("Örnek servis firmaları oluşturuluyor...")
    create_sample_services()
    print("İşlem tamamlandı!")