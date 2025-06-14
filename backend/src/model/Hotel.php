<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * Hotel Model Class
 * 
 * Handles all database operations related to the hotels table in the hotel management system.
 * Provides methods for creating, retrieving, updating, and deleting hotel records.
 */
class Hotel
{
    /**
     * Database connection instance
     */
    protected $db;

    /**
     * Name of the hotels database table
     */
    private $table_name = 'hotels';

    /**
     * Error message from the last operation
     */
    private $lastError = '';

    /**
     * Constructor - initializes the database connection
     */
    public function __construct()
    {
        try {
            $database = new Database();
            $this->db = $database->getConnection();
        } catch (PDOException $e) {
            $this->lastError = "Database connection failed: " . $e->getMessage();
            error_log($this->lastError);
            throw $e;
        }
    }

    /**
     * Get the last error message
     * 
     * @return string
     */
    public function getLastError(): string
    {
        return $this->lastError;
    }

    /**
     * Execute a query with proper error handling
     * 
     * @param \PDOStatement $stmt
     * @param array $params
     * @return bool
     */
    protected function executeQuery(\PDOStatement $stmt, array $params = []): bool
    {
        try {
            return $stmt->execute($params);
        } catch (PDOException $e) {
            $this->lastError = "Query execution failed: " . $e->getMessage();
            error_log($this->lastError . " - SQL: " . $stmt->queryString);
            return false;
        }
    }

    /**
     * Get all hotel records
     * 
     * @return array
     */
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, name, address, city, country, email, phone, description, created_at, updated_at FROM {$this->table_name}");
            if (!$this->executeQuery($stmt)) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to get hotels: " . $e->getMessage();
            error_log($this->lastError);
            return [];
        }
    }

    /**
     * Get a single hotel by ID
     * 
     * @param string $id
     * @return array|null
     */
    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, name, address, city, country, email, phone, description, created_at, updated_at FROM {$this->table_name} WHERE id = ?");
            if (!$this->executeQuery($stmt, [$id])) {
                return null;
            }
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get hotel: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Create a new hotel record
     * 
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool
    {
        $id = Uuid::uuid4()->toString();
        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, name, address, city, country, email, phone, description) 
            VALUES (:id, :name, :address, :city, :country, :email, :phone, :description)");

        $params = [
            ':id' => $id,
            ':name' => $data['name'] ?? null,
            ':address' => $data['address'] ?? null,
            ':city' => $data['city'] ?? null,
            ':country' => $data['country'] ?? null,
            ':email' => $data['email'] ?? null,
            ':phone' => $data['phone'] ?? null,
            ':description' => $data['description'] ?? null,
        ];

        return $this->executeQuery($stmt, $params);
    }

    /**
     * Update an existing hotel
     * 
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        if (empty($data)) {
            $this->lastError = "No data provided for update.";
            return false;
        }

        $fields = [];
        $params = [':id' => $id];

        foreach ($data as $key => $value) {
            // Only allow known columns to be updated
            if (in_array($key, ['name', 'address', 'city', 'country', 'email', 'phone', 'description'])) {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }

        if (empty($fields)) {
            $this->lastError = "No valid fields provided for update.";
            return false;
        }

        // Always update the timestamp
        $fields[] = "updated_at = CURRENT_TIMESTAMP";

        $sql = "UPDATE {$this->table_name} SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $this->executeQuery($stmt, $params);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update hotel: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }


    /**
     * Delete a hotel by ID
     * 
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $this->executeQuery($stmt, [$id]);
    }
}
