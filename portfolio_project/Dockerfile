# Use an official Python runtime as a parent image
FROM python:3.11-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /portfolio_project # Ensure this path is correct for your project structure

# Set the working directory in the container to /portfolio_project
WORKDIR /portfolio_project

# Install system dependencies needed for psycopg2 (PostgreSQL adapter)
# This ensures that the 'psycopg2-binary' Python package can be installed successfully
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    # Install netcat for the entrypoint script's health check
    netcat-traditional \
    # Clean up apt cache to keep image small
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install Python dependencies
# We copy requirements.txt first to leverage Docker's build cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entrypoint script and make it executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy the rest of the application code
# The '.' refers to the build context (your local 'portfolio_project/' directory)
# The '.' refers to the WORKDIR inside the container (/portfolio_project)
COPY . .

# Expose the port Django will run on
EXPOSE 8000

# Use the custom entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Command to run the Gunicorn server (passed as arguments to entrypoint.sh)
# This is the actual production command for your Django app
CMD ["gunicorn", "project.wsgi:application", "--bind", "0.0.0.0:$PORT"]
