#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status.

# portfolio_project/entrypoint.sh

# Use Python's urllib.parse to reliably extract components from DATABASE_URL
# Render provides DATABASE_URL as an environment variable
DATABASE_URL_VAR="$DATABASE_URL" # Get the DATABASE_URL environment variable

# Extract components using Python's urllib.parse
DB_HOST=$(python -c "import os, urllib.parse; url = urllib.parse.urlparse(os.environ.get('DATABASE_URL_VAR', '')); print(url.hostname or 'db')" || echo "db")
DB_PORT=$(python -c "import os, urllib.parse; url = urllib.parse.urlparse(os.environ.get('DATABASE_URL_VAR', '')); print(url.port or '5432')" || echo "5432")
DB_USER=$(python -c "import os, urllib.parse; url = urllib.parse.urlparse(os.environ.get('DATABASE_URL_VAR', '')); print(url.username or 'django_user')" || echo "django_user")
DB_NAME=$(python -c "import os, urllib.parse; url = urllib.parse.urlparse(os.environ.get('DATABASE_URL_VAR', '')); print(url.path[1:] or 'django_db')" || echo "django_db")

# Fallback for local development if DATABASE_URL is not fully set (though it should be on Render)
# These fallbacks are now handled by the python -c commands, but kept for clarity if needed elsewhere.
# DB_HOST=${DB_HOST:-db}
# DB_PORT=${DB_PORT:-5432}
# DB_USER=${DB_USER:-django_user}
# DB_NAME=${DB_NAME:-django_db}


# Wait for PostgreSQL to be ready using pg_isready
# This is more robust than nc -z for PostgreSQL
echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT} for user ${DB_USER} and database ${DB_NAME}..."
MAX_RETRIES=30 # Increased retries for database readiness
RETRY_COUNT=0
SLEEP_INTERVAL=2 # Seconds to wait between retries

# Use the extracted components with pg_isready
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "Max retries reached. PostgreSQL is not ready. Exiting."
    exit 1 # Exit with an error code if database is not ready after max retries
  fi
  echo "PostgreSQL not ready. Retrying in ${SLEEP_INTERVAL} seconds... (Attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep $SLEEP_INTERVAL
done
echo "PostgreSQL is ready."


# Apply database migrations
echo "Applying database migrations..."
MAX_MIGRATION_RETRIES=15 # Retries for migrations in case of transient DB issues
MIGRATION_RETRY_COUNT=0
MIGRATION_SLEEP_INTERVAL=3

until python manage.py migrate --noinput; do
  MIGRATION_RETRY_COUNT=$((MIGRATION_RETRY_COUNT+1))
  if [ $MIGRATION_RETRY_COUNT -ge $MAX_MIGRATION_RETRIES ]; then
    echo "Max migration retries reached. Could not apply migrations. Exiting."
    exit 1 # Exit with an error code if migrations fail after max retries
  fi
  echo "Migrations failed. Retrying in ${MIGRATION_SLEEP_INTERVAL} seconds... (Attempt $MIGRATION_RETRY_COUNT/$MAX_MIGRATION_RETRIES)"
  sleep $MIGRATION_SLEEP_INTERVAL
done
echo "Database migrations applied successfully."

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput
echo "Static files collected."

# Start the Django application
echo "Starting Django application..."
exec "$@" # This executes the CMD from the Dockerfile (e.g., gunicorn project.wsgi:application ...)
