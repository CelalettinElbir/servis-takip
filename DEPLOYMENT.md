# Servis Takip Sistemi - Docker Deployment

Bu proje React frontend, Django backend, PostgreSQL veritabanı ve Redis kullanarak oluşturulmuş bir servis takip sistemidir. Nginx reverse proxy ile makine IP'si üzerinden yayınlanabilir.

## Sistem Gereksinimleri

- Docker ve Docker Compose
- 4GB+ RAM
- 10GB+ disk alanı

## Kurulum ve Deployment

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd servis-takip
```

### 2. Makine IP'nizi Ayarlayın

`docker/nginx/default.conf` dosyasındaki `server_name` kısmını düzenleyin:
```nginx
server_name your-machine-ip;  # Örnek: 192.168.1.100
```

`backend/settings/production.py` dosyasında `ALLOWED_HOSTS` ve `CORS_ALLOWED_ORIGINS` ayarlarını güncelleyin:
```python
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '192.168.1.100',  # Makine IP'nizi buraya ekleyin
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost",
    "http://192.168.1.100",  # Makine IP'nizi buraya ekleyin
]
```

### 3. Environment Dosyası Oluşturun

`.env` dosyası oluşturun:
```env
# Database
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# Django
SECRET_KEY=your-very-secure-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-machine-ip

# Redis
REDIS_URL=redis://redis:6379/0
```

### 4. Deployment Komutları

#### Production Deployment
```bash
# Servisleri başlat
docker-compose up -d

# Logları kontrol et
docker-compose logs -f

# Servisleri durdur
docker-compose down

# Verileri silmek için
docker-compose down -v
```

#### Development Deployment
```bash
# Sadece veritabanı servisleri
docker-compose up -d db redis

# Django'yu lokal çalıştır
cd backend
python manage.py runserver --settings=backend.settings.development

# React'i lokal çalıştır
cd frontend
npm run dev
```

## Erişim URL'leri

- **Frontend**: http://your-machine-ip/
- **Backend API**: http://your-machine-ip/api/
- **Admin Panel**: http://your-machine-ip/admin/
- **API Docs**: http://your-machine-ip/swagger/

## Varsayılan Kullanıcı

- **Username**: admin
- **Password**: admin123

## Servis Durumu Kontrolü

```bash
# Tüm servislerin durumu
docker-compose ps

# Belirli bir servisin logları
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx

# Health check
curl http://your-machine-ip/health
```

## Veritabanı İşlemleri

```bash
# Migrations uygula
docker-compose exec backend python manage.py migrate

# Superuser oluştur
docker-compose exec backend python manage.py createsuperuser

# Shell'e bağlan
docker-compose exec backend python manage.py shell

# PostgreSQL'e bağlan
docker-compose exec db psql -U postgres -d postgres
```

## Güvenlik Notları

1. `.env` dosyasındaki şifreleri değiştirin
2. Production'da SSL sertifikası kullanın
3. Firewall ayarlarını yapılandırın
4. Düzenli backup alın

## Sorun Giderme

### Servisler ayağa kalkmıyor
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### PostgreSQL bağlantı sorunu
```bash
docker-compose restart db
docker-compose logs db
```

### Nginx hatası
```bash
docker-compose restart nginx
docker-compose logs nginx
```

### Port çakışması
```bash
# Kullanılan portları kontrol et
netstat -tulpn | grep :80
netstat -tulpn | grep :8000

# Port değiştirmek için docker-compose.yml dosyasını düzenleyin
```

## Backup

```bash
# Veritabanı backup
docker-compose exec db pg_dump -U postgres postgres > backup.sql

# Veritabanı restore
docker-compose exec -T db psql -U postgres postgres < backup.sql

# Volume backup
docker run --rm -v servis-takip_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## Monitoring

```bash
# Resource kullanımı
docker stats

# Disk kullanımı
docker system df

# Temizlik
docker system prune -a
```