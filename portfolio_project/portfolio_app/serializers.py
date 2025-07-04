# portfolio_project/portfolio_app/serializers.py

from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model.
    Converts Project model instances to JSON and vice-versa.
    """
    # Define 'image' as a SerializerMethodField to control its URL generation
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__' # Include all fields from the Project model

    def get_image(self, obj):
        """
        Returns the relative URL for the project image.
        This allows the Vite proxy to handle routing the request.
        """
        if obj.image:
            # Crucial change: Return only the relative URL provided by Django's ImageField
            # The frontend's Vite proxy will then handle routing this relative path.
            return obj.image.url
        return None # Return None if no image is associated
