<?php
// Initialisation de l'application Slim : chargement de l'autoloader, création de l'app, inclusion des routes et lancement du serveur.

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

// Création de l'application Slim
$app = AppFactory::create();

// Inclusion des routes
(require __DIR__ . '/../src/routes.php')($app);

// Lancement de l'application
$app->run();