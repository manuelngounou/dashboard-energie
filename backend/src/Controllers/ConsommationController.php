<?php
namespace Hp\Backend\Controllers;

use PDO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Hp\Backend\Database;

class ConsommationController {

    // CREATE
    public function create(Request $request, Response $response) {
        $data = $request->getParsedBody();

        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            INSERT INTO consommations (date_mesure, kwh, appareil, commentaire)
            VALUES (:date_mesure, :kwh, :appareil, :commentaire)
            RETURNING id
        ");

        $stmt->execute([
            ':date_mesure' => $data['date_mesure'],
            ':kwh' => $data['kwh'],
            ':appareil' => $data['appareil'] ?? null,
            ':commentaire' => $data['commentaire'] ?? null
        ]);

        $id = $stmt->fetchColumn();

        $response->getBody()->write(json_encode(['id' => $id]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    // READ ALL
    public function index(Request $request, Response $response) {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query("SELECT * FROM consommations ORDER BY date_mesure DESC");
        $consommations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response->getBody()->write(json_encode($consommations));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // READ ONE
    public function show(Request $request, Response $response, array $args) {
        $id = (int)$args['id'];

        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM consommations WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $consommation = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$consommation) {
            $response->getBody()->write(json_encode(['error' => 'Consommation non trouvée']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        $response->getBody()->write(json_encode($consommation));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // UPDATE
    public function update(Request $request, Response $response, array $args) {
        $id = (int)$args['id'];
        $data = $request->getParsedBody();

        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            UPDATE consommations
            SET date_mesure = :date_mesure,
                kwh = :kwh,
                appareil = :appareil,
                commentaire = :commentaire
            WHERE id = :id
        ");

        $stmt->execute([
            ':date_mesure' => $data['date_mesure'],
            ':kwh' => $data['kwh'],
            ':appareil' => $data['appareil'],
            ':commentaire' => $data['commentaire'],
            ':id' => $id
        ]);

        $response->getBody()->write(json_encode(['message' => 'Consommation mise à jour avec succès']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // DELETE
    public function delete(Request $request, Response $response, array $args) {
        $id = (int)$args['id'];

        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("DELETE FROM consommations WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $response->getBody()->write(json_encode(['message' => 'Consommation supprimée avec succès']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
