# Dockerfile backend : image PHP + Apache, installation des extensions PDO/PDO_PGSQL, copie du code et configuration du serveur.
FROM php:8.0-apache
# Installation des extensions PDO et PDO_PGSQL pour la connexion à PostgreSQL.
RUN docker-php-ext-install pdo pdo_pgsql
# Copie du code source de l'application dans le conteneur.
COPY . /var/www/html/
# Configuration du serveur Apache pour utiliser le fichier .htaccess et rediriger toutes les requêtes vers index.php.
RUN a2enmod rewrite && \
    echo '<Directory /var/www/html/>' > /etc/apache2/conf-available/dashboard.conf && \
    echo '    AllowOverride All' >> /etc/apache2/conf-available/dashboard.conf && \
    echo '</Directory>' >> /etc/apache2/conf-available/dashboard.conf && \
    a2enconf dashboard
# Exposition du port 80 pour accéder à l'application.
EXPOSE 80
# Commande de démarrage du serveur Apache.
CMD ["apache2-foreground"]