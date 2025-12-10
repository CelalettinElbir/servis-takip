#!/bin/sh
set -e

echo "Waiting for Django..."
sleep 5

echo "Starting Celery Beat..."
celery -A backend beat -l info
