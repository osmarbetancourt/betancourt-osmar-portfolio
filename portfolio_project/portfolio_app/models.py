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

class ImageGenerationUsage(models.Model):
    """
    Tracks how many times a user (by Google user ID) has generated images in a given month/year.
    """
    google_user_id = models.CharField(max_length=128)
    month = models.PositiveSmallIntegerField()
    year = models.PositiveSmallIntegerField()
    count = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("google_user_id", "month", "year")
        verbose_name = "Image Generation Usage"
        verbose_name_plural = "Image Generation Usages"

    def __str__(self):
        return f"{self.google_user_id} - {self.month}/{self.year}: {self.count}"

class Conversation(models.Model):
    """
    Represents a chat session for a user (can be ongoing or per topic).
    """
    google_user_id = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=255, blank=True, null=True, help_text="Optional title or topic for the conversation")

    class Meta:
        ordering = ['-updated_at']
        verbose_name = "Conversation"
        verbose_name_plural = "Conversations"

    def __str__(self):
        return f"Conversation {self.id} ({self.google_user_id})"

class Message(models.Model):
    """
    Represents a single message in a conversation (user or assistant).
    """
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=16, choices=[('user', 'User'), ('assistant', 'Assistant')])
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    token_count = models.PositiveIntegerField(default=0, help_text="Optional: store token count for cost tracking")

    class Meta:
        ordering = ['created_at']
        verbose_name = "Message"
        verbose_name_plural = "Messages"

    def __str__(self):
        return f"{self.sender} ({self.created_at}): {self.content[:40]}..."