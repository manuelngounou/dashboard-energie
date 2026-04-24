# ÉnergieTrack — Frontend v2.0

Dashboard de suivi énergétique personnel. Refonte complète du frontend en React/Vite avec design moderne dark theme.

## Stack technique

| Couche      | Technologie                        |
|-------------|------------------------------------|
| Frontend    | React 18 + Vite 5                  |
| Routing     | React Router v6                    |
| Style       | Tailwind CSS 3 + CSS custom        |
| Graphiques  | Recharts 2                         |
| Icônes      | Lucide React                       |
| HTTP        | Fetch API (natif)                  |
| Typos       | Syne (display) + DM Sans + JetBrains Mono |
| Serveur     | Nginx 1.27 Alpine (production)     |
| Backend     | PHP 8 / Slim 4 + PostgreSQL 15     |

---

## Architecture du projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── charts/       # Recharts (Area, Bar, Pie, Spark)
│   │   ├── layout/       # Sidebar, TopBar, Layout
│   │   └── ui/           # StatCard, Modal, Table, Alert, Form…
│   ├── hooks/
│   │   └── useData.js    # useFetch, useConsommations, useStats
│   ├── pages/
│   │   ├── Dashboard.jsx       # Vue d'ensemble + recommandations
│   │   ├── Consommations.jsx   # CRUD complet avec filtres et tri
│   │   └── Statistiques.jsx    # Graphiques, classements, insights
│   ├── services/
│   │   └── api.js        # Couche API (alignée sur les endpoints PHP)
│   ├── utils/
│   │   └── helpers.js    # Formatage, couleurs, agrégations
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── Dockerfile            # Multi-stage : Vite build → Nginx
├── nginx.conf            # SPA routing + proxy /api → backend
├── docker-compose.yml    # Remplace celui à la racine du projet
├── .env.example
└── package.json
```

---

## Démarrage rapide

### Option 1 — Docker Compose (recommandé)

Remplacez le dossier `frontend/` de votre projet par ce dossier,
puis depuis la **racine du projet** :

```bash
# Copier ce dossier en remplacement du frontend existant
cp -r nouveau-frontend/* dashboard-energie/frontend/

# Lancer l'ensemble de la stack
cd dashboard-energie
docker-compose up --build
```

L'application sera disponible sur **http://localhost:8082**

Le backend PHP reste accessible directement sur **http://localhost:5000**

### Option 2 — Développement local (sans Docker)

Prérequis : Node.js ≥ 18

```bash
cd frontend

# 1. Installer les dépendances
npm install

# 2. Configurer l'URL du backend
cp .env.example .env
# Éditer .env → VITE_API_URL=http://localhost:5000

# 3. Démarrer le serveur de dev
npm run dev
# → http://localhost:3000
```

> Le serveur Vite proxifie automatiquement `/api/*` vers le backend.

### Commandes utiles

```bash
npm run dev      # Serveur de développement (HMR)
npm run build    # Build de production dans dist/
npm run preview  # Prévisualiser le build de production
```

---

## Endpoints API utilisés

Le frontend communique uniquement avec ces endpoints (backend PHP/Slim) :

```
GET    /consommations          → liste toutes les saisies
POST   /consommations          → créer une saisie
GET    /consommations/:id       → lire une saisie
PUT    /consommations/:id       → mettre à jour une saisie
DELETE /consommations/:id       → supprimer une saisie
GET    /stats/total-kwh         → { total_kwh: "70.75" }
GET    /stats/moyenne-kwh       → { moyenne_kwh: "14.15" }
GET    /stats/par-appareil      → [{ appareil, total_kwh }, …]
```

Format de payload pour POST/PUT :
```json
{
  "date_mesure":  "2026-04-24",
  "kwh":           12.50,
  "appareil":     "Chauffage",
  "commentaire":  "Journée froide"
}
```

---

## Pages disponibles

| Route            | Page           | Fonctionnalités                                               |
|------------------|----------------|---------------------------------------------------------------|
| `/`              | Dashboard      | KPIs, graphique 7j, répartition appareils, saisies récentes, recommandations |
| `/consommations` | Consommations  | Liste complète, recherche, filtres, tri, ajout, édition, suppression |
| `/statistiques`  | Statistiques   | Graphiques (7j/30j/mensuel), classement appareils, records, insights |

---

## Personnalisation

### Tarif kWh
Dans `src/utils/helpers.js`, modifiez la constante :
```js
export function fmtEuros(kwh, tarif = 0.2516) { ... }
```

### Appareils disponibles dans le formulaire
Dans `src/components/ui/ConsommationForm.jsx` :
```js
const APPAREILS = ['Chauffage', 'Éclairage', ...]
```

### Couleurs par appareil
Dans `src/utils/helpers.js`, fonction `appareilColor()`.

### Seuils des recommandations
Dans `src/pages/Dashboard.jsx`, fonction `buildRecommandations()`.

---

## Notes sur le docker-compose

Le `docker-compose.yml` fourni est une mise à jour du fichier original.
Changements apportés :
- **Frontend** : passage de `nginx:alpine` (copie statique) à un build multi-stage (Vite + Nginx)
- **Arg de build** `VITE_API_URL=/api` : le frontend appelle `/api/…` et Nginx proxifie vers `backend:80`
- Ajout de `restart: unless-stopped` sur tous les services
- Aucune modification du backend ou de PostgreSQL

---

## Kubernetes

Les fichiers YAML Kubernetes existants (`kubernetes/`) restent valides.
Pour le frontend, mettez à jour l'image dans `frontend-deployment.yaml` :
```yaml
image: dashboard-frontend:2.0  # votre tag après docker build
```
Et ajoutez une variable d'environnement ou un ConfigMap pour `VITE_API_URL`
pointant vers le service backend Kubernetes.
