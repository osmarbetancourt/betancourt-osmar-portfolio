# portfolio_project/project/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve # <--- NEW: Import serve view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portfolio_app.urls')), # Your API URLs and health check
]

# Serve media files in development (as before)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # NEW: Serve media files in production (when DEBUG is False)
    # This is a simple solution for small projects; for large scale, use a dedicated web server or CDN.
    urlpatterns += [
        path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
