# Use an official Python runtime as a parent image
FROM python:3.11-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /project

# Set the working directory in the container to /project
WORKDIR /project

# Install system dependencies needed for psycopg2 (PostgreSQL adapter)
# This ensures that the 'psycopg2-binary' Python package can be installed successfully
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    # Clean up apt cache to keep image small
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install Python dependencies
# We copy requirements.txt first to leverage Docker's build cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
# The '.' refers to the build context (your local 'project/' directory)
# The '.' refers to the WORKDIR inside the container (/project)
COPY . .

# Expose the port Django will run on
EXPOSE 8000

# Command to run the Django development server
# This will keep the container running and serve the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]