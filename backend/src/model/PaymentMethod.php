<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * PaymentMethod Model Class
 * 
 * Handles all database operations related to the payment_methods table.
 */
class PaymentMethod
{
    protected $db;
    private string $table_name = 'payment_methods';
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

    public function getAllByHotel(string $hotel_id): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE hotel_id = ?");
            if (!$this->executeQuery($stmt, [$hotel_id])) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to fetch payment methods: " . $e->getMessage();
            return [];
        }
    }

    public function getAllByBranch(string $branch_id): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE branch_id = ?");
            if (!$this->executeQuery($stmt, [$branch_id])) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to fetch payment methods by branch: " . $e->getMessage();
            return [];
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
            $this->lastError = "Failed to fetch payment method: " . $e->getMessage();
            return null;
        }
    }

    public function create(array $data): bool
    {
        $requiredFields = ['hotel_id', 'name'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, hotel_id, branch_id, name, details, is_active) 
            VALUES (:id, :hotel_id, :branch_id, :name, :details, :is_active)");

        $params = [
            ':id' => $id,
            ':hotel_id' => $data['hotel_id'],
            ':branch_id' => $data['branch_id'] ?? null,
            ':name' => $data['name'],
            ':details' => json_encode($data['details'] ?? []),
            ':is_active' => isset($data['is_active']) ? (bool)$data['is_active'] : true,
        ];

        return $this->executeQuery($stmt, $params);
    }

    public function update(string $id, array $data): bool
    {
        if (empty($data)) {
            $this->lastError = "No data provided for update.";
            return false;
        }

        $fields = [];
        $params = [':id' => $id];

        foreach ($data as $key => $value) {
            if (in_array($key, ['hotel_id', 'branch_id', 'name', 'details', 'is_active'])) {
                $fields[] = "$key = :$key";
                $params[":$key"] = $key === 'details' ? json_encode($value) : $value;
            }
        }

        $fields[] = "updated_at = CURRENT_TIMESTAMP";

        $sql = "UPDATE {$this->table_name} SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $this->executeQuery($stmt, $params);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update payment method: " . $e->getMessage();
            return false;
        }
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $this->executeQuery($stmt, [$id]);
    }
}
