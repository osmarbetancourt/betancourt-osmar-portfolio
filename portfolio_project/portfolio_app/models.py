# portfolio_project/portfolio_app/models.py

from django.db import models

class Project(models.Model):
    """
    Represents a project in your portfolio.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    github_link = models.URLField(blank=True, null=True)
    live_link = models.URLField(blank=True, null=True)
    # New field for project image
    image = models.ImageField(upload_to='project_images/', blank=True, null=True)
    technologies = models.CharField(max_length=500, help_text="Comma-separated list of technologies used")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at'] # Order projects by most recent first

    def __str__(self):
        return self.title