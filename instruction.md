# PRD : Assistant IA de Clôture de Projet (RAG-Manager)

## 1. Objectif Business
Réduire le support post-projet en offrant aux clients une interface de chat (style ChatGPT) capable de répondre à toute question technique ou contractuelle en se basant exclusivement sur la documentation indexée du projet.

## 2. Stack Technique
- **Frontend :** Next.js 16 (App Router), Tailwind CSS, Shadcn/ui.
- **Backend :** Python FastAPI (Orchestration RAG).
- **LLM :** Google Gemini 1.5 Pro (via Vertex AI API) pour ses capacités multimodales.
- **Vector DB :** ChromaDB (stockée localement sur la VM) ou Pinecone.
- **Infrastructure :** Google Cloud VM (Compute Engine).
- **Sécurité :** Authentification SSO via NextAuth.js (Google Provider).

## 3. Fonctionnalités Clés
### A. Interface de Chat (ChatGPT-like)
- Streaming des réponses en temps réel (Vercel AI SDK).
- Support du Markdown (tableaux, listes, gras).
- Système de "Citations" : Afficher sous chaque réponse les documents sources utilisés.
- Gestion d'historique des conversations.

### B. Panneau d'Administration des Sources
- Interface pour parcourir les dossiers (Google Drive / Cloud Storage).
- Sélection dynamique des dossiers à indexer pour le RAG via des checkboxes.
- Bouton "Synchroniser" déclenchant le pipeline d'embedding (Backend).

## 4. Spécifications du RAG & Parsing
- **Multi-formats :** Extraction de données depuis PDF, Word, Excel (formatage en texte structuré), PPTX et Images.
- **Mode Strict :** Le System Prompt doit interdire l'hallucination (répondre "Je ne sais pas" si hors contexte).
- **Isolation :** Les données doivent être cloisonnées par ID de projet.

## 5. Architecture de l'Application (Filesystem)
/app (Next.js 16)
  /api/chat/route.ts       -> Proxy vers le backend FastAPI (Streaming)
  /chat/page.tsx           -> Interface de conversation
  /admin/sources/page.tsx  -> Gestion des dossiers et indexation
/components
  /chat-bubble.tsx         -> Rendu des messages et sources
  /file-tree.tsx           -> Explorateur de fichiers pour admin
/lib
  /auth.ts                 -> Utilitaire pour extraire l'email utilisateur des headers IAP

## 6. Schéma API (FastAPI)
- `POST /api/v1/query` : Prend la question + context_id, retourne un stream de texte.
- `POST /api/v1/ingest` : Prend une liste d'URLs de dossiers, lance le processing.
## 7. Guide de Démarrage Rapide

### Backend (Python FastAPI)
1. `cd backend`
2. `source venv/bin/activate`
3. `uvicorn app.main:app --reload --port 8000`

### Frontend (Next.js)
1. `cd frontend`
2. `npm run dev` (Port 3000 par défaut)

---
*Note: Le frontend attend l'API sur le port 8000 par défaut.*