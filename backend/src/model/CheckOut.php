<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * CheckOut Model Class
 * Handles all database operations related to the `check_outs` table.
 */
class CheckOut
{
    protected $db;
    private $table_name = 'check_outs';
    private $lastError = '';

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

    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name}");
            if (!$this->executeQuery($stmt)) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to get check-outs: " . $e->getMessage();
            error_log($this->lastError);
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
            $this->lastError = "Failed to get check-out: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    public function create(array $data): bool
    {
        $requiredFields = ['hotel_id', 'branch_id', 'booking_id', 'checked_out_by'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, hotel_id, branch_id, booking_id, checked_out_by, additional_charges, notes) 
            VALUES (:id, :hotel_id, :branch_id, :booking_id, :checked_out_by, :additional_charges, :notes)");

        $params = [
            ':id' => $id,
            ':hotel_id' => $data['hotel_id'],
            ':branch_id' => $data['branch_id'],
            ':booking_id' => $data['booking_id'],
            ':checked_out_by' => $data['checked_out_by'],
            ':additional_charges' => $data['additional_charges'] ?? 0.00,
            ':notes' => $data['notes'] ?? null,
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
            if (in_array($key, [
                'hotel_id',
                'branch_id',
                'booking_id',
                'checked_out_by',
                'additional_charges',
                'notes'
            ])) {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }

        // 'checked_out_at' is DEFAULT CURRENT_TIMESTAMP, generally not updated explicitly after creation
        // If it needs to be mutable, add it to the in_array above.

        $sql = "UPDATE {$this->table_name} SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $this->executeQuery($stmt, $params);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update check-out: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $this->executeQuery($stmt, [$id]);
    }
}
