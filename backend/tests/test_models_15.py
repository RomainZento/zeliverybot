import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

try:
    print("Searching for 1.5 models...")
    for model in client.models.list():
        if '1.5' in model.name:
            print(f"Found: {model.name}")
except Exception as e:
    print(f"Error: {e}")
