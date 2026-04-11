<?php
use Hp\Backend\Database;
use Hp\Backend\Controllers\ConsommationController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

return function ($app) {

    // Route de test
    $app->get('/ping', function (Request $request, Response $response) {
        $response->getBody()->write("pong");
        return $response;
    });

    // Test de connexion à la base de données
    $app->get('/test-db', function ($request, $response) {
        try {
            $pdo = (new Database())->getConnection();
            $response->getBody()->write("Connexion OK");
        } catch (Exception $e) {
            $response->getBody()->write("Erreur : " . $e->getMessage());
        }
        return $response;
    });

    // Routes CRUD pour les consommations
    $app->post('/consommations', [ConsommationController::class, 'create']);
    $app->get('/consommations', [ConsommationController::class, 'index']);
    $app->get('/consommations/{id}', [ConsommationController::class, 'show']);
    $app->put('/consommations/{id}', [ConsommationController::class, 'update']);
    $app->delete('/consommations/{id}', [ConsommationController::class, 'delete']);
};
