<?php
// Classe Database : gère la connexion PDO à PostgreSQL, lit les variables d'environnement, retourne une instance PDO réutilisable.
class Database {
    private $pdo;

    public function __construct() {
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $dbname = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $pass = getenv('DB_PASS');
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        try {
            $this->pdo = new PDO($dsn, $user, $pass);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    public function getConnection() {
        return $this->pdo;
    }
}