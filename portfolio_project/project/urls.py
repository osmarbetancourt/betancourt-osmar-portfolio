# portfolio_project/project/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings # Import settings
from django.conf.urls.static import static # Import static helper

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portfolio_app.urls')), # Your API URLs
]

# Serve media files only in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)