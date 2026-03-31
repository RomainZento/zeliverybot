import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

try:
    print("Searching for embedding models...")
    for model in client.models.list():
        if 'embedding' in model.name:
            print(f"Name: {model.name}")
except Exception as e:
    print(f"Error: {e}")
