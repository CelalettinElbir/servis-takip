#!/bin/sh
set -e

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

echo "Starting Celery..."
exec "$@"
