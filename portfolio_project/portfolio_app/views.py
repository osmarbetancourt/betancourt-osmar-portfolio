
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
