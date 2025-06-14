<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * EmergencyContact Model Class
 * 
 * Handles all database operations related to the emergency_contacts table.
 */
class EmergencyContact
{
    protected $db;
    private string $table_name = 'emergency_contacts';
    private string $lastError = '';

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

    public function getLastError(): string
    {
        return $this->lastError;
    }

    protected function executeQuery(PDOStatement $stmt, array $params = []): bool
    {
        try {
            return $stmt->execute($params);
        } catch (PDOException $e) {
            $this->lastError = "Query execution failed: " . $e->getMessage();
            error_log($this->lastError . " - SQL: " . $stmt->queryString);
            return false;
        }
    }

    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE id = ?");
            if (!$this->executeQuery($stmt, [$id])) {
                return null;
            }
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to fetch contact: " . $e->getMessage();
            return null;
        }
    }

    public function getAllByCustomer(string $customer_id): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE customer_id = ?");
            if (!$this->executeQuery($stmt, [$customer_id])) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to fetch emergency contacts: " . $e->getMessage();
            return [];
        }
    }

    public function create(array $data): bool
    {
        $required = ['customer_id', 'name', 'relationship', 'phone'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();
        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, customer_id, name, relationship, phone, email) 
            VALUES (:id, :customer_id, :name, :relationship, :phone, :email)");

        $params = [
            ':id' => $id,
            ':customer_id' => $data['customer_id'],
            ':name' => $data['name'],
            ':relationship' => $data['relationship'],
            ':phone' => $data['phone'],
            ':email' => $data['email'] ?? null
        ];

        return $this->executeQuery($stmt, $params);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $this->executeQuery($stmt, [$id]);
    }
}
