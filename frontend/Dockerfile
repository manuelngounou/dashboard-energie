# Dockerfile frontend : image Nginx, copie des fichiers HTML/CSS/JS, configuration du serveur statique.
FROM nginx:alpine
# Copie des fichiers HTML, CSS et JS dans le répertoire de Nginx pour servir le contenu statique.
COPY . /usr/share/nginx/html/
# Exposition du port 80 pour accéder à l'application.
EXPOSE 80
# Commande de démarrage du serveur Nginx.
CMD ["nginx", "-g", "daemon off;"]
