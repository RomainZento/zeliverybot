import os
from google import genai
from dotenv import load_dotenv

# Load .env from the current directory
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try parent directory if not found (monorepo structure)
    load_dotenv("../.env")
    api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Erreur : GEMINI_API_KEY non trouvée dans .env")
    exit(1)

try:
    client = genai.Client(api_key=api_key)
    print("💡 Liste des modèles disponibles pour votre clé :")
    print("-" * 50)
    for m in client.models.list():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"❌ Erreur lors de la récupération des modèles : {e}")
