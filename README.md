# ZeliveryBot - Assistant IA de Clôture de Projet (RAG)

Ce projet est un assistant IA style ChatGPT capable de répondre à des questions sur la documentation d'un projet en utilisant une architecture RAG (Retrieval-Augmented Generation).

## Structure du Projet

- **/frontend** : Application Next.js 15 (Tailwind CSS, Shadcn/ui).
- **/backend** : API FastAPI (Python) pour l'orchestration RAG, embeddings et intégration Gemini 1.5 Pro.

---

## 🚀 Démarrage Rapide

### 1. Démarrer le Backend (API)

Le backend doit être lancé en premier car le frontend en a besoin pour récupérer les sources et l'historique.

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
*L'API sera disponible sur [http://localhost:8000](http://localhost:8000).*

### 2. Démarrer le Frontend

Dans un autre terminal :

```bash
cd frontend
npm run dev
```
*L'application sera accessible sur [http://localhost:3000](http://localhost:3000).*

---

## 🛠 Configuration (Variables d'environnement)

### Backend (`/backend/.env`)
Assurez-vous d'avoir les clés API nécessaires :
- `GOOGLE_API_KEY` (pour Gemini)
- `PROJECT_ID`
- `LOCATION`

### Frontend (`/frontend/.env.local`)
- `NEXT_PUBLIC_API_URL=http://localhost:8000`
- `NEXTAUTH_SECRET` : Clé secrète NextAuth (voir section Sécurité).
- `NEXTAUTH_URL=http://localhost:3000`
- `GOOGLE_CLIENT_ID` : ID Client OAuth Google.
- `GOOGLE_CLIENT_SECRET` : Secret Client OAuth Google.

---

## 🔐 Sécurité & Authentification (SSO)

L'accès à l'application est protégé par **NextAuth.js** via le protocole Google SSO.

### 1. Générer la clé secrète NextAuth
Exécutez cette commande dans votre terminal pour générer une clé robuste :
```bash
openssl rand -base64 32
```
Copiez le résultat dans la variable `NEXTAUTH_SECRET` du fichier `.env.local`.

### 2. Configurer Google Cloud Console (OAuth)
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/).
2. Dans **API et services > Identifiants**, cliquez sur **Créer des identifiants > ID de client OAuth**.
3. Choisissez **Application Web**.
    - **Origines JavaScript autorisées** : `http://localhost:3000`
    - **URIs de redirection autorisés** : `http://localhost:3000/api/auth/callback/google`
4. Récupérez le **Client ID** et le **Client Secret** et ajoutez-les au fichier `.env.local`.

---

## 📖 Documentation
Pour plus de détails sur la conception et les fonctionnalités, consultez [instruction.md](./instruction.md).
