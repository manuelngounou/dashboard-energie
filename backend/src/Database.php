<?php
// Classe Database : gère la connexion PDO à PostgreSQL, lit les variables d'environnement, retourne une instance PDO réutilisable.
namespace Hp\Backend;
use PDO;
use PDOException;

class Database
{
    private $pdo;

    public function __construct()
    {
        $host   = getenv('DB_HOST')     ?: 'postgres-service';
        $port   = getenv('DB_PORT')     ?: '5432';
        $dbname = getenv('DB_NAME')     ?: 'dashboard_energie';
        $user   = getenv('DB_USER')     ?: 'postgres';
        $pass   = getenv('DB_PASSWORD') ?: 'postgres'; 
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        try {
            $this->pdo = new PDO($dsn, $user, $pass);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    //méthode getInstance pour implémenter le pattern singleton
    private static $instance = null;

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}
