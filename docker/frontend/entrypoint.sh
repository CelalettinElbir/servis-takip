#!/bin/sh
set -e

echo "Starting React application with nginx..."

# Replace API URL inside built React files
if [ -n "$API_URL" ]; then
    echo "Setting API URL: $API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec \
        sed -i "s|http://localhost:8000|$API_URL|g" {} \;
fi

echo "React application started successfully!"

exec "$@"
