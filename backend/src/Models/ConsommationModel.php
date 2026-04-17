<?php

namespace Hp\Backend\Models;

use Hp\Backend\Database;
use PDO;

class ConsommationModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = (new Database())->getConnection();
    }

    // CREATE
    public function create(array $data): int
    {
        $stmt = $this->db->prepare("
            INSERT INTO consommation (date_mesure, kwh, appareil, commentaire)
            VALUES (:date_mesure, :kwh, :appareil, :commentaire)
            RETURNING id
        ");

        $stmt->execute([
            ':date_mesure' => $data['date_mesure'],
            ':kwh' => $data['kwh'],
            ':appareil' => $data['appareil'] ?? null,
            ':commentaire' => $data['commentaire'] ?? null
        ]);

        return (int) $stmt->fetchColumn();
    }

    // READ ALL
    public function findAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM consommation ORDER BY date_mesure DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // READ ONE
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM consommation WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ?: null;
    }

    // UPDATE
    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare("
            UPDATE consommation
            SET date_mesure = :date_mesure,
                kwh = :kwh,
                appareil = :appareil,
                commentaire = :commentaire
            WHERE id = :id
        ");

        return $stmt->execute([
            ':date_mesure' => $data['date_mesure'],
            ':kwh' => $data['kwh'],
            ':appareil' => $data['appareil'],
            ':commentaire' => $data['commentaire'],
            ':id' => $id
        ]);
    }

    // DELETE
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM consommation WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    // STATS
    public function totalKwh(): array
    {
        $stmt = $this->db->query("SELECT SUM(kwh) AS total_kwh FROM consommation");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function moyenneKwh(): array
    {
        $stmt = $this->db->query("SELECT AVG(kwh) AS moyenne_kwh FROM consommation");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function parAppareil(): array
    {
        $stmt = $this->db->query("
            SELECT appareil, SUM(kwh) AS total_kwh
            FROM consommation
            GROUP BY appareil
            ORDER BY total_kwh DESC
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
