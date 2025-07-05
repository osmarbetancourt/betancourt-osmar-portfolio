#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status.

# portfolio_project/entrypoint.sh

# Parse DATABASE_URL to get host, port, user, and dbname for pg_isready
# Render provides DATABASE_URL as an environment variable
DATABASE_URL="$DATABASE_URL" # Ensure it's treated as a shell variable
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\(.*\):.*@.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Fallback for local development if DATABASE_URL is not fully set (though it should be on Render)
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-django_user} # Assuming a default user for local testing
DB_NAME=${DB_NAME:-django_db} # Assuming a default db name for local testing


# Wait for PostgreSQL to be ready using pg_isready
# This is more robust than nc -z for PostgreSQL
echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT} to be ready for user ${DB_USER} and database ${DB_NAME}..."
MAX_RETRIES=30 # Increased retries for database readiness
RETRY_COUNT=0
SLEEP_INTERVAL=2 # Seconds to wait between retries

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "Max retries reached. PostgreSQL is not ready."
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
    echo "Max migration retries reached. Could not apply migrations."
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
