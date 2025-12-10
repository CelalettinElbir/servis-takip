# Python 3.11 slim base image
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN groupadd -r app && useradd -r -g app app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
        curl \
        netcat-traditional \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/static /app/media \
    && chown -R app:app /app

WORKDIR /app

COPY requirements1.txt .

RUN pip install --no-cache-dir -r requirements1.txt

COPY . .

# Entrypoint dosyalarını kopyala
COPY docker/backend/entrypoint.sh /entrypoint.sh
COPY docker/backend/entrypoint_celery.sh /entrypoint_celery.sh
COPY docker/backend/entrypoint_beat.sh /entrypoint_beat.sh

RUN chmod +x /entrypoint.sh /entrypoint_celery.sh /entrypoint_beat.sh

RUN chown -R app:app /app

USER app

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "backend.wsgi:application"]
