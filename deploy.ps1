# Servis Takip Sistemi Deployment Script (PowerShell)
# Bu script projenizi Windows'ta production ortamına deploy eder

param(
    [switch]$SkipBuild = $false,
    [switch]$Development = $false
)

# Colors for PowerShell
function Write-ColorOutput([ConsoleColor]$color, [string]$message) {
    $originalColor = $Host.UI.RawUI.ForegroundColor
    $Host.UI.RawUI.ForegroundColor = $color
    Write-Output $message
    $Host.UI.RawUI.ForegroundColor = $originalColor
}

Write-ColorOutput Blue "================================"
Write-ColorOutput Blue " Servis Takip Sistemi Deployment"
Write-ColorOutput Blue "================================"

# Makine IP'sini al
try {
    $MACHINE_IP = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }).IPv4Address.IPAddress | Select-Object -First 1
    Write-ColorOutput Yellow "Makine IP'si tespit edildi: $MACHINE_IP"
} catch {
    $MACHINE_IP = "localhost"
    Write-ColorOutput Red "IP tespit edilemedi, localhost kullanılacak"
}

# .env dosyasının varlığını kontrol et
if (!(Test-Path ".env")) {
    Write-ColorOutput Yellow ".env dosyası bulunamadı, oluşturuluyor..."
    
    # Güvenli şifre üret
    $DB_PASSWORD = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 25 | ForEach-Object {[char]$_})
    $SECRET_KEY = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
    
    $envContent = @"
# Database Configuration
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$DB_PASSWORD

# Django Configuration
SECRET_KEY=$SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,$MACHINE_IP

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Machine IP
MACHINE_IP=$MACHINE_IP
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-ColorOutput Green ".env dosyası oluşturuldu"
} else {
    Write-ColorOutput Green ".env dosyası mevcut"
}

# Docker kontrolü
Write-ColorOutput Yellow "Docker kontrolü yapılıyor..."
try {
    docker --version | Out-Null
    Write-ColorOutput Green "Docker hazır"
} catch {
    Write-ColorOutput Red "Docker yüklü değil! Lütfen Docker Desktop'u yükleyin."
    exit 1
}

try {
    docker-compose --version | Out-Null
    Write-ColorOutput Green "Docker Compose hazır"
} catch {
    Write-ColorOutput Red "Docker Compose yüklü değil!"
    exit 1
}

# Mevcut containerları durdur
Write-ColorOutput Yellow "Mevcut containerlar durduruluyor..."
try {
    docker-compose down 2>$null
} catch {
    # Ignore error if no containers are running
}

if (!$SkipBuild) {
    # Docker images'larını build et
    Write-ColorOutput Yellow "Docker images build ediliyor..."
    docker-compose build --no-cache
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "Build işlemi başarısız!"
        exit 1
    }
}

# Environment'a göre başlat
if ($Development) {
    Write-ColorOutput Yellow "Development servisleri başlatılıyor..."
    docker-compose up -d db redis
    Write-ColorOutput Green "Veritabanı servisleri başlatıldı"
    Write-ColorOutput Yellow "Django'yu manuel olarak başlatın: python manage.py runserver --settings=backend.settings.development"
    Write-ColorOutput Yellow "React'i manuel olarak başlatın: cd frontend && npm run dev"
} else {
    # Production ortamını başlat
    Write-ColorOutput Yellow "Production servisleri başlatılıyor..."
    docker-compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "Servisler başlatılamadı!"
        docker-compose logs
        exit 1
    }
    
    # Servislerin başlamasını bekle
    Write-ColorOutput Yellow "Servisler başlatılıyor, lütfen bekleyin..."
    Start-Sleep -Seconds 30
    
    # Health check
    Write-ColorOutput Yellow "Servis durumu kontrol ediliyor..."
    $healthCheckSuccess = $false
    for ($i = 1; $i -le 10; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-ColorOutput Green "✅ Nginx çalışıyor"
                $healthCheckSuccess = $true
                break
            }
        } catch {
            Write-ColorOutput Yellow "Nginx henüz hazır değil, bekleniyor... ($i/10)"
            Start-Sleep -Seconds 5
        }
    }
    
    if (!$healthCheckSuccess) {
        Write-ColorOutput Red "Servisler başlatılamadı, logları kontrol edin:"
        docker-compose logs
    }
}

# Servis durumlarını göster
Write-ColorOutput Blue "`nServis Durumu:"
docker-compose ps

if (!$Development) {
    # Erişim bilgileri
    Write-ColorOutput Green "`n================================"
    Write-ColorOutput Green " Deployment Tamamlandı! 🚀"
    Write-ColorOutput Green "================================"
    Write-ColorOutput Blue "`nErişim URL'leri:"
    Write-ColorOutput Green "🌐 Frontend: http://$MACHINE_IP/"
    Write-ColorOutput Green "🔧 API: http://$MACHINE_IP/api/"
    Write-ColorOutput Green "⚙️  Admin Panel: http://$MACHINE_IP/admin/"
    Write-ColorOutput Green "📚 API Docs: http://$MACHINE_IP/swagger/"
    Write-ColorOutput Blue "`nVarsayılan Admin Bilgileri:"
    Write-ColorOutput Yellow "👤 Kullanıcı: admin"
    Write-ColorOutput Yellow "🔐 Şifre: admin123"
}

Write-ColorOutput Yellow "`nFaydalı Komutlar:"
Write-ColorOutput Green "• Logları görüntüle: docker-compose logs -f"
Write-ColorOutput Green "• Servisleri durdur: docker-compose down"
Write-ColorOutput Green "• Servisleri yeniden başlat: docker-compose restart"
Write-ColorOutput Green "• Durum kontrol et: docker-compose ps"

Write-ColorOutput Green "`nDeployment tamamlandı! 🎉"