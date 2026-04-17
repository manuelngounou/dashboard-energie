<?php
// Initialisation de l'application Slim : chargement de l'autoloader, création de l'app, inclusion des routes et lancement du serveur.

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

require __DIR__ . '/../vendor/autoload.php';

// Création de l'application Slim
$app = AppFactory::create();

// Middleware CORS - doit être ajouté APRÈS la création de l'app
$app->add(function (ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
    // Gestion preflight OPTIONS
    if ($request->getMethod() === 'OPTIONS') {
        $response = new \Slim\Psr7\Response();
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->withStatus(200);
    }

    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

// Inclusion des routes
(require __DIR__ . '/../src/routes.php')($app);

// IMPORTANT : pour que Slim lise le JSON dans le body des requêtes, il faut ajouter ce middleware
$app->addBodyParsingMiddleware();

// Lancement de l'application
$app->run();