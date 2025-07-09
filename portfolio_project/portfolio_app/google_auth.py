from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings

def verify_google_token(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
        # ID token is valid. Get the user's Google Account ID from the decoded token.
        return idinfo  # Contains user info (sub, email, etc.)
    except Exception as e:
        print(f"Google token verification failed: {e}")
        return None
