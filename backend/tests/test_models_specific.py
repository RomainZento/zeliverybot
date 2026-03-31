import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

try:
    models = client.models.list()
    target_models = [m for m in models if 'gemini-1.5-pro' in m.name]
    for m in target_models:
        print(f"Name: {m.name}, Display: {m.display_name}")
    
    if not target_models:
        print("Model not found. Here are some options:")
        # Show some common models
        for m in list(models)[:10]:
            print(f"Name: {m.name}")
except Exception as e:
    print(f"Error: {e}")
