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
        $host = 'postgres'; // Utiliser le nom du service Docker
        $port =  '5432';
        $dbname =  'dashboard_energie';
        $user = 'postgres';
        $pass = 'postgres';
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
