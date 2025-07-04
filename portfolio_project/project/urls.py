from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include URLs from your portfolio_app
    # This maps any requests to the root of your site ('') to your portfolio_app's URLs
    path('', include('portfolio_app.urls')),
]