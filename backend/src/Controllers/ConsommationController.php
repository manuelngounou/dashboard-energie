<?php

namespace Hp\Backend\Controllers;

use Hp\Backend\Models\ConsommationModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ConsommationController
{
    private ConsommationModel $model;

    public function __construct()
    {
        $this->model = new ConsommationModel();
    }

    // CREATE
    public function create(Request $request, Response $response)
    {
        $data = $request->getParsedBody();
        $id = $this->model->create($data);

        $response->getBody()->write(json_encode(['id' => $id]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    // READ ALL
    public function index(Request $request, Response $response)
    {
        $consommations = $this->model->findAll();

        $response->getBody()->write(json_encode($consommations));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // READ ONE
    public function show(Request $request, Response $response, array $args)
    {
        $id = (int)$args['id'];
        $consommation = $this->model->findById($id);

        if (!$consommation) {
            $response->getBody()->write(json_encode(['error' => 'Consommation non trouvée']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        $response->getBody()->write(json_encode($consommation));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // UPDATE
    public function update(Request $request, Response $response, array $args)
    {
        $id = (int)$args['id'];
        $data = $request->getParsedBody();

        $this->model->update($id, $data);

        $response->getBody()->write(json_encode(['message' => 'Consommation mise à jour avec succès']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // DELETE
    public function delete(Request $request, Response $response, array $args)
    {
        $id = (int)$args['id'];
        $this->model->delete($id);

        $response->getBody()->write(json_encode(['message' => 'Consommation supprimée avec succès']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // STATS
    public function totalKwh(Request $request, Response $response)
    {
        $result = $this->model->totalKwh();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function moyenneKwh(Request $request, Response $response)
    {
        $result = $this->model->moyenneKwh();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function parAppareil(Request $request, Response $response)
    {
        $result = $this->model->parAppareil();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
