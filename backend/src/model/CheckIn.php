<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * CheckIn Model Class
 * Handles all database operations related to the `check_ins` table.
 */
class CheckIn
{
    protected $db;
    private $table_name = 'check_ins';
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
            $this->lastError = "Failed to get check-ins: " . $e->getMessage();
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
            $this->lastError = "Failed to get check-in: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    public function create(array $data): bool
    {
        $requiredFields = ['hotel_id', 'branch_id', 'booking_id', 'checked_in_by'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, hotel_id, branch_id, booking_id, checked_in_by) 
            VALUES (:id, :hotel_id, :branch_id, :booking_id, :checked_in_by)");

        $params = [
            ':id' => $id,
            ':hotel_id' => $data['hotel_id'],
            ':branch_id' => $data['branch_id'],
            ':booking_id' => $data['booking_id'],
            ':checked_in_by' => $data['checked_in_by'],
        ];

        return $this->executeQuery($stmt, $params);
    }

    // No update method for check_ins as per schema; check_in_at is default and no other mutable fields
    // public function update(string $id, array $data): bool
    // {
    //     $this->lastError = "Update operation not supported for check_ins.";
    //     return false;
    // }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $this->executeQuery($stmt, [$id]);
    }
}
