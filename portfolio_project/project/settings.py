import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url
import logging # Added for logging configuration

# Configure logging to show more details for debugging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO', # Set to INFO for more detailed Django logs
            'propagate': False,
        },
        'django.security.DisallowedHost': { # Specific logger for ALLOWED_HOSTS errors
            'handlers': ['console'],
            'level': 'CRITICAL', # Log these errors at CRITICAL level
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
}

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR is now the 'portfolio_project' directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env for local development
# This line should only be active for local development.
# In production, environment variables are typically set directly by the hosting platform.
load_dotenv(BASE_DIR / '.env')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# Always get SECRET_KEY from environment variables. Provide a dummy default for local dev.
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'a-very-insecure-default-key-for-local-dev-only')

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG should be False in production. Control via environment variable.
DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'

# ALLOWED_HOSTS should list your production domains. Control via environment variable.
ALLOWED_HOSTS_STR = os.environ.get('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost') # Default for local dev
ALLOWED_HOSTS = [h.strip() for h in ALLOWED_HOSTS_STR.split(',') if h.strip()]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'portfolio_app',
    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Added WhiteNoiseMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# These paths are correct because 'project' is now the name of the inner config module
ROOT_URLCONF = 'project.urls'
WSGI_APPLICATION = 'project.wsgi.application'
ASGI_APPLICATION = 'project.asgi.application'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# Database
# Use dj_database_url to parse the DATABASE_URL environment variable
# This is the recommended way to handle database connections in production on Render
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'postgres://user:password@localhost:5432/dbname'), # Fallback for local
        conn_max_age=600, # Optional: Max age of database connections
        ssl_require=os.environ.get('DATABASE_SSL_REQUIRE', 'False') == 'True' # NEW: SSL config
    )
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage' # Added WhiteNoise static files storage

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly', # MODIFIED: Allow read-only for unauthenticated
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [ # NEW: Add authentication classes
        'rest_framework.authentication.SessionAuthentication',
        # 'rest_framework.authentication.TokenAuthentication', # Consider TokenAuthentication for API clients
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer', # Default to JSON for API responses
        'rest_framework.renderers.BrowsableAPIRenderer', # For development, provides a browsable API
    ],
}

# CORS Headers settings
# In production, CORS_ALLOWED_ORIGINS should be explicitly set to your frontend's domain(s)
# via environment variables. For local development, localhost is included.
CORS_ALLOWED_ORIGINS_STR = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')
CORS_ALLOWED_ORIGINS = [h.strip() for h in CORS_ALLOWED_ORIGINS_STR.split(',') if h.strip()]

# CORS_ALLOW_ALL_ORIGINS should always be False in production.
CORS_ALLOW_ALL_ORIGINS = os.environ.get('CORS_ALLOW_ALL_ORIGINS', 'False') == 'True'


# CSRF Configuration for Production/Development
# These settings are critical for security in production.
# For local development (DEBUG=True), Django's CSRF middleware might be more lenient,
# but it's good practice to define them.
# The @csrf_exempt decorator on the chat view/URL handles the specific bypass for that endpoint.
CSRF_COOKIE_SAMESITE = os.environ.get('CSRF_COOKIE_SAMESITE', 'Lax') # 'Lax' is good default
# MODIFIED: Ensure CSRF_COOKIE_SECURE is True in production via environment variable
CSRF_COOKIE_SECURE = os.environ.get('DJANGO_CSRF_COOKIE_SECURE', 'False') == 'True'
# MODIFIED: Ensure CSRF_TRUSTED_ORIGINS includes Render domain via environment variable
CSRF_TRUSTED_ORIGINS_STR = os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')
CSRF_TRUSTED_ORIGINS = [h.strip() for h in CSRF_TRUSTED_ORIGINS_STR.split(',') if h.strip()]


# Media files (user-uploaded content)
MEDIA_URL = '/media/'
# MODIFIED: Set MEDIA_ROOT to the absolute path of the Docker volume mount
MEDIA_ROOT = '/project/media'

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
