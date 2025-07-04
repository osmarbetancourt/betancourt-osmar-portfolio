# portfolio_project/portfolio_app/views.py

from rest_framework import viewsets
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows projects to be viewed or edited.
    Provides list, retrieve, create, update, and delete actions.
    """
    queryset = Project.objects.all() # Get all Project objects from the database
    serializer_class = ProjectSerializer # Use the ProjectSerializer for data conversion

    # Override get_serializer_context to pass the request object
    def get_serializer_context(self):
        """
        Passes the request object to the serializer context.
        This is necessary for ImageField to generate absolute URLs.
        """
        return {'request': self.request}

# You can add other view functions here if needed for non-API views
# For example, if you had a traditional Django template for a home page:
# from django.shortcuts import render
# def home(request):
#     return render(request, 'portfolio_app/home.html')
