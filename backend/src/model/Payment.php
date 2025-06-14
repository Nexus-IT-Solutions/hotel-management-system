<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

class Payment
{
    protected $db;
    private string $table_name = 'payments';
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
        $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE id = ?");
        if (!$this->executeQuery($stmt, [$id])) return null;
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function getAllByBooking(string $booking_id): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE booking_id = ?");
        if (!$this->executeQuery($stmt, [$booking_id])) return [];
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $data): bool
    {
        $required = ['hotel_id', 'branch_id', 'booking_id', 'payment_method_id', 'amount', 'status'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();
        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, hotel_id, branch_id, booking_id, payment_method_id, amount, reference, status, notes)
            VALUES (:id, :hotel_id, :branch_id, :booking_id, :payment_method_id, :amount, :reference, :status, :notes)");

        $params = [
            ':id' => $id,
            ':hotel_id' => $data['hotel_id'],
            ':branch_id' => $data['branch_id'],
            ':booking_id' => $data['booking_id'],
            ':payment_method_id' => $data['payment_method_id'],
            ':amount' => $data['amount'],
            ':reference' => $data['reference'] ?? null,
            ':status' => $data['status'],
            ':notes' => $data['notes'] ?? null,
        ];

        return $this->executeQuery($stmt, $params);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $this->executeQuery($stmt, [$id]);
    }
}
