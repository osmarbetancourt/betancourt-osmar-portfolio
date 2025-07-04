# Use an official Python runtime as a parent image
FROM python:3.11-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container to /app
# This means all subsequent commands (COPY, CMD) will be relative to /app
WORKDIR /project

# Install system dependencies needed for psycopg2 (PostgreSQL adapter)
# This ensures that the 'psycopg2-binary' Python package can be installed successfully
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    # Clean up apt cache to keep image small
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install Python dependencies
# The '.' here refers to the build context, which is 'betancourtosmar_portfolio/project/'
# So, requirements.txt from 'project/' is copied into '/app/requirements.txt' in the container
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
# All files/folders from 'betancourtosmar_portfolio/project/' are copied into '/app/'
COPY . .

# Expose the port Django will run on (still relevant for Django later, but not for this test)
EXPOSE 8000

# Command to run the Python test file
# Since WORKDIR is /app, this executes /app/main.py
CMD ["python", "main.py"]