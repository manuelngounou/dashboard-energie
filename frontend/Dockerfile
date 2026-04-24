# ── Stage 1 : Build React/Vite ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances en premier (cache layer)
COPY package*.json ./
RUN npm install

# Copier le code source et builder
COPY . .

# URL du backend passée en build arg (peut être overridée)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2 : Servir avec Nginx ─────────────────────────────────────────
FROM nginx:1.27-alpine

# Supprimer la config Nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Config Nginx custom : SPA routing + proxy API
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
