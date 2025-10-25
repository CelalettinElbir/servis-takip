
mkdir myproject && cd myproject
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirments

db oluşturma.
docker run -d --name servisTakip -e POSTGRES_PASSWORD=localpass -p 5432:5432 -v servisTakippostgres_data:/var/lib/postgresql/data postgres:latest

python manage.py makemigrations 
python manage.py migrate

python manage.py runserver

