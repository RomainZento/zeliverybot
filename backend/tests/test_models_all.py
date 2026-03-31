import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

try:
    print("Listing ALL models...")
    models = list(client.models.list())
    for m in models:
        print(f"Name: {m.name}")
except Exception as e:
    print(f"Error: {e}")
