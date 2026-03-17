<?php
// Définition des routes de l'API Slim : routes de test, routes CRUD pour les consommations, et endpoints pour les statistiques.

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

return function ($app) {

    // Route de test
    $app->get('/ping', function (Request $request, Response $response) {
        $response->getBody()->write("pong");
        return $response;
    });

};