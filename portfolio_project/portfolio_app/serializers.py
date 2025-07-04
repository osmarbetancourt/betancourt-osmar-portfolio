# portfolio_project/portfolio_app/serializers.py

from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model.
    Converts Project model instances to JSON and vice-versa.
    """
    class Meta:
        model = Project
        fields = '__all__' # Include all fields from the Project model
        # You could also specify fields explicitly:
        # fields = ['id', 'title', 'description', 'github_link', 'live_link', 'technologies', 'created_at']
