import os
import google.auth
from google.auth.transport.requests import Request
import requests

# Get API key from environment
api_key = os.getenv("GOOGLE_API_KEY")

# Endpoint for listing models
url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + api_key

response = requests.get(url)
if response.status_code == 200:
    models = response.json().get("models", [])
    for model in models:
        print(f"Model name: {model.get('name')}")
        print(f"Supported methods: {model.get('supportedGenerationMethods', [])}\n")
else:
    print("Error listing models:", response.text)
