
mkdir myproject && cd myproject
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirments

db oluşturma.
docker run -d --name servisTakip -e POSTGRES_PASSWORD=localpass -p 5432:5432 -v servisTakippostgres_data:/var/lib/postgresql/data postgres:latest

docker run -d --name redis-celery -p 6379:6379 redis:latest
redis güncellemesi yapıacaktır.



python manage.py makemigrations 
python manage.py migrate

python manage.py runserver




celery -A backend  worker --pool=solo -l info


celery -A backend worker --loglevel=info --pool=solo

celery -A backend beat --loglevel=info --scheduler django_celery_beat.schedulers:DatabaseScheduler





from seeder.seedClass import seederClass

# Excel dosyasının yolunu belirtin
excel_path = "path/to/your/excel.xlsx"

# Seeder sınıfını başlat
seeder = seederClass(excel_path)

# Verileri içe aktar
seeder.seed_customers()  # Müşteri verilerini içe aktar
seeder.seed_brands()  ,



başarılı şekli buradakidir.
from seeder.seedClass import seederClass
seeder = seederClass("MARKALAR.xlsx")    
seeder.seed_brands()