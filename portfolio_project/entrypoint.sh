#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status.

# portfolio_project/entrypoint.sh

# Get the database host from environment variable, default to 'db' for local Docker Compose
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432} # Get DB port from env, default to 5432

# Wait for PostgreSQL to be reachable on the network level
echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT} to be reachable..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 0.5
done
echo "PostgreSQL is reachable."

# Wait for PostgreSQL to be ready for Django connections and apply migrations
# This loop attempts to run 'migrate' and retries if it fails due to connection issues,
# giving the database more time to fully initialize.
MAX_RETRIES=15
RETRY_COUNT=0
SLEEP_INTERVAL=2 # Seconds to wait between retries

until python manage.py migrate --noinput; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "Max retries reached. Could not connect to database or apply migrations."
    exit 1 # Exit with an error code if migrations fail after max retries
  fi
  echo "Database not ready or migrations failed. Retrying in ${SLEEP_INTERVAL} seconds... (Attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep $SLEEP_INTERVAL
done
echo "Database migrations applied successfully."

# Add a small delay after migrations to ensure database is fully settled
echo "Giving database a moment to settle..."
sleep 5 # Sleep for 5 seconds

# Start the Django development server
echo "Starting Django development server..."
exec "$@" # This executes the CMD from the Dockerfile (e.g., python manage.py runserver ...)
