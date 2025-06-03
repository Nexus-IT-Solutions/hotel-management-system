<?php

require_once __DIR__ . '/../../vendor/autoload.php';

class Database
{
    private $driver;
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct()
    {
        $this->host     = $_ENV['DB_HOST'];
        $this->db_name  = $_ENV['DB_NAME'];
        $this->username = $_ENV['DB_USERNAME'];
        $this->password = $_ENV['DB_PASSWORD'];
        $this->driver   = $_ENV['DB_DRIVER'];
    }

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new \PDO(
                "{$this->driver}:host={$this->host};dbname={$this->db_name};charset=utf8mb4",
                $this->username,
                $this->password
            );
            
            $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            $this->conn->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
            
            
        } catch (\PDOException $exception) {
            // Log the error message
            
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}