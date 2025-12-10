#!/bin/sh
set -e

echo "Starting Django application..."

echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  echo "PostgreSQL unavailable — retrying..."
  sleep 1
done
echo "PostgreSQL is available!"

echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  echo "Redis unavailable — retrying..."
  sleep 1
done
echo "Redis is available!"

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Creating superuser if missing..."
python manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser created.")
else:
    print("Superuser already exists.")
EOF

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Django setup finished."

exec "$@"
