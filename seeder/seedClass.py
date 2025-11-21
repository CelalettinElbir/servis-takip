
import os
import pandas as pd
from api.models import Customer, Brand
from django.db import transaction
import pdb
class seederClass:
    def __init__(self, excel_file_path):
        self.excel_file_path = excel_file_path
    
    def read_excel_file(self, file_path=None, sheet_name=None):
        if file_path is None:
            file_path = self.excel_file_path
        try:
            return pd.read_excel(file_path, sheet_name=sheet_name)
        except Exception as e:
            print(f"Excel dosyası okunurken hata oluştu: {e}")
            return None

    @transaction.atomic
    def seed_customers(self, sheet_name="cariler"):
        """Müşteri verilerini içe aktar"""
        df = self.read_excel_file(self.excel_file_path, sheet_name)
        if df is None:
            return False

        success_count = 0
        error_count = 0

        for _, row in df.iterrows():
            try:
                

                # Excel sütun isimlerini modele uygun şekilde eşleştir
                customer_data = {
                    'company_code': str(row.get('Firma Adı', '')).strip(),
                    'company_name': str(row.get('Firma Adı', '')).strip(),
                    'company_long_name': str(row.get('Ünvan', '')).strip(),
                    'address': str(row.get('Adres', '')).strip(),
                    'phone': str(row.get('Telefon', '')).strip(),
                    'email': str(row.get('E-Mail', '')).strip(),
                    'tax_number': str(row.get('Vergi No', '')).strip(),
                    'tax_office': str(row.get('Vergi Dairesi', '')).strip(),
                    'is_active': True
                }

                # Boş company_code veya company_name kontrolü
                if not customer_data['company_code'] or not customer_data['company_name']:
                    print(f"Atlanıyor: Firma Kodu veya Firma Adı boş olan kayıt")
                    continue

                # Var olan müşteriyi güncelle veya yeni müşteri oluştur
                customer, created = Customer.objects.update_or_create(
                    company_code=customer_data['company_code'],
                    defaults=customer_data
                )
                success_count += 1
                if created:
                    print(f"Yeni müşteri eklendi: {customer_data['company_name']}")
                else:
                    print(f"Müşteri güncellendi: {customer_data['company_name']}")

            except Exception as e:
                print(f"Müşteri verisi eklenirken hata: {str(e)}")
                error_count += 1

        print(f"Müşteri verisi içe aktarma tamamlandı. Başarılı: {success_count}, Hata: {error_count}")
        return True

    @transaction.atomic
    def seed_brands(self, sheet_name="Sayfa1"):
        """Excel'den markaları Brand modeline aktarır"""
        df = self.read_excel_file(self.excel_file_path, sheet_name)
        if df is None:
            return False

        # Kolon ismini küçük harfe çevirerek kontrol et
        columns = [col.lower() for col in df.columns]
        if "markalar" not in columns:
            print("❌ Excel dosyasında 'markalar' adında bir kolon bulunamadı.")
            print(f"Bulunan kolonlar: {df.columns.tolist()}")
            return False

        success_count = 0
        error_count = 0

        for _, row in df.iterrows():
            try:
                # Kolon ismini küçük harfe göre çek
                brand_name = str(row.get('markalar', '')).strip()

                if not brand_name:
                    print("⚠️ Boş marka adı atlanıyor.")
                    continue

                # Marka varsa güncelle, yoksa oluştur
                brand, created = Brand.objects.update_or_create(
                    name=brand_name,
                    defaults={
                        "description": "",
                        "is_active": True
                    }
                )

                success_count += 1

            except Exception as e:
                print(f"🚨 Marka eklenirken hata oluştu: {str(e)}")
                error_count += 1

        print(f"✅ Marka aktarımı tamamlandı — Başarılı: {success_count}, Hatalı: {error_count}")
        return True


    @transaction.atomic
    def seed_Services_name(self)