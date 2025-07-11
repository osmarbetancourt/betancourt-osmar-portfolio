import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url
import logging

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
            'level': 'INFO',
            'propagate': False,
        },
        'django.security.DisallowedHost': {
            'handlers': ['console'],
            'level': 'CRITICAL',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
}

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env for local development
load_dotenv(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'a-very-insecure-default-key-for-local-dev-only')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'

ALLOWED_HOSTS_STR = os.environ.get('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost')
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
    # 'whitenoise.runserver_nostatic', # Only needed if you use Django's runserver with WhiteNoise in dev
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # IMPORTANT: WhiteNoise should be very high up
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

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
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'postgres://user:password@localhost:5432/dbname'),
        conn_max_age=600,
        ssl_require=os.environ.get('DATABASE_SSL_REQUIRE', 'False') == 'True'
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
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

CORS_ALLOWED_ORIGINS_STR = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')
CORS_ALLOWED_ORIGINS = [h.strip() for h in CORS_ALLOWED_ORIGINS_STR.split(',') if h.strip()]
CORS_ALLOW_ALL_ORIGINS = os.environ.get('CORS_ALLOW_ALL_ORIGINS', 'False') == 'True'


# CSRF Configuration for Production/Development
CSRF_COOKIE_SAMESITE = os.environ.get('CSRF_COOKIE_SAMESITE', 'Lax')
# MODIFIED: Ensure CSRF_COOKIE_SECURE is False when DEBUG is True for local http
CSRF_COOKIE_SECURE = False if DEBUG else os.environ.get('DJANGO_CSRF_COOKIE_SECURE', 'False') == 'True'
CSRF_TRUSTED_ORIGINS_STR = os.environ.get('CSRF_TRUSTED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')
CSRF_TRUSTED_ORIGINS = [h.strip() for h in CSRF_TRUSTED_ORIGINS_STR.split(',') if h.strip()]

# Essential for Django behind an SSL-terminating proxy like Render
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# Ensure CSRF token is sent with session
CSRF_USE_SESSIONS = True
# Make CSRF cookie HTTP-only for security (prevents client-side JS access)
CSRF_COOKIE_HTTPONLY = True


# Media files (user-uploaded content)
MEDIA_URL = '/media/'
MEDIA_ROOT = '/project/media' # Absolute path for Docker volume/Render Persistent Disk

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

# --- Hugging Face Inference Endpoint Settings ---
# This is the ID of your fine-tuned model on Hugging Face Hub.
# For a deployed Inference Endpoint, this would be the endpoint URL.
# For the public inference API, it's the model ID (e.g., "betancourtosmar/fine-tuned-mistral-django-qa")
HF_MODEL_ID = os.getenv('HF_MODEL_ID', 'betancourtosmar/fine-tuned-mistral-django-qa') # Default to your model ID
HF_API_TOKEN = os.getenv('HF_API_TOKEN') # Your Hugging Face API token (read access)

# --- Google reCAPTCHA Settings ---
# Your reCAPTCHA Secret Key (obtained from Google reCAPTCHA Admin Console)
RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY')

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)

# --- Pinecone Settings ---
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY", None)
PINECONE_HOST = os.environ.get("PINECONE_HOST", None)

GOOGLE_SAFE_BROWSING_API_KEY = os.getenv('GOOGLE_SAFE_BROWSING_API_KEY')