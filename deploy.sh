#!/bin/bash

# Servis Takip Sistemi Deployment Script
# Bu script projenizi production ortamına deploy eder

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE} Servis Takip Sistemi Deployment${NC}"
echo -e "${BLUE}================================${NC}"

# Makine IP'sini al
MACHINE_IP=$(hostname -I | awk '{print $1}')
echo -e "${YELLOW}Makine IP'si tespit edildi: ${MACHINE_IP}${NC}"

# .env dosyasının varlığını kontrol et
if [ ! -f .env ]; then
    echo -e "${YELLOW}.env dosyası bulunamadı, oluşturuluyor...${NC}"
    
    # Güvenli şifre üret
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    SECRET_KEY=$(openssl rand -base64 50 | tr -d "=+/" | cut -c1-50)
    
    cat > .env << EOF
# Database Configuration
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${DB_PASSWORD}

# Django Configuration
SECRET_KEY=${SECRET_KEY}
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,${MACHINE_IP}

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Machine IP
MACHINE_IP=${MACHINE_IP}
EOF
    
    echo -e "${GREEN}.env dosyası oluşturuldu${NC}"
else
    echo -e "${GREEN}.env dosyası mevcut${NC}"
fi

# Docker ve Docker Compose kontrolü
echo -e "${YELLOW}Docker kontrolü yapılıyor...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker yüklü değil! Lütfen Docker'ı yükleyin.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose yüklü değil! Lütfen Docker Compose'u yükleyin.${NC}"
    exit 1
fi

echo -e "${GREEN}Docker ve Docker Compose hazır${NC}"

# Mevcut containerları durdur
echo -e "${YELLOW}Mevcut containerlar durduruluyor...${NC}"
docker-compose down 2>/dev/null || true

# Docker images'larını build et
echo -e "${YELLOW}Docker images build ediliyor...${NC}"
docker-compose build --no-cache

# Production ortamını başlat
echo -e "${YELLOW}Production servisleri başlatılıyor...${NC}"
docker-compose up -d

# Servislerin başlamasını bekle
echo -e "${YELLOW}Servisler başlatılıyor, lütfen bekleyin...${NC}"
sleep 30

# Health check
echo -e "${YELLOW}Servis durumu kontrol ediliyor...${NC}"
for i in {1..10}; do
    if curl -f "http://localhost/health" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Nginx çalışıyor${NC}"
        break
    else
        echo -e "${YELLOW}Nginx henüz hazır değil, bekleniyor... ($i/10)${NC}"
        sleep 5
    fi
done

# Servis durumlarını göster
echo -e "\n${BLUE}Servis Durumu:${NC}"
docker-compose ps

# Erişim bilgileri
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN} Deployment Tamamlandı! 🚀${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "\n${BLUE}Erişim URL'leri:${NC}"
echo -e "🌐 Frontend: ${GREEN}http://${MACHINE_IP}/${NC}"
echo -e "🔧 API: ${GREEN}http://${MACHINE_IP}/api/${NC}"
echo -e "⚙️  Admin Panel: ${GREEN}http://${MACHINE_IP}/admin/${NC}"
echo -e "📚 API Docs: ${GREEN}http://${MACHINE_IP}/swagger/${NC}"
echo -e "\n${BLUE}Varsayılan Admin Bilgileri:${NC}"
echo -e "👤 Kullanıcı: ${YELLOW}admin${NC}"
echo -e "🔐 Şifre: ${YELLOW}admin123${NC}"

echo -e "\n${YELLOW}Faydalı Komutlar:${NC}"
echo -e "• Logları görüntüle: ${GREEN}docker-compose logs -f${NC}"
echo -e "• Servisleri durdur: ${GREEN}docker-compose down${NC}"
echo -e "• Servisleri yeniden başlat: ${GREEN}docker-compose restart${NC}"
echo -e "• Durum kontrol et: ${GREEN}docker-compose ps${NC}"

echo -e "\n${GREEN}Deployment başarıyla tamamlandı! 🎉${NC}"