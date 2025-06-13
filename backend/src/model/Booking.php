<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * Booking Model Class
 * * Handles all database operations related to the `bookings` table.
 */
class Booking
{
    protected $db;
    private $table_name = 'bookings';
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

    public function getAllBookingSummary(): array
    {
        try {
            // Construct the SQL query with LEFT JOINs and aliases
            $query = "
                SELECT
                    b.id AS id,
                    c.full_name AS customer,
                    c.phone AS phone,
                    r.room_number AS room,
                    rt.name AS roomType,
                    b.check_in_date AS checkIn,
                    b.check_out_date AS checkOut,
                    b.number_of_guests AS guests,
                    b.status AS status,
                    b.total_amount AS total
                FROM
                    " . $this->table_name . " b
                LEFT JOIN
                    customers c ON b.customer_id = c.id
                LEFT JOIN
                    rooms r ON b.room_id = r.id
                LEFT JOIN
                    room_types rt ON b.room_type_id = rt.id
                ORDER BY
                    b.created_at DESC; -- Or b.check_in_date DESC, depending on desired order
            ";

            $stmt = $this->db->prepare($query);

            if (!$this->executeQuery($stmt)) {
                // executeQuery already logs the error and sets $this->lastError
                return [];
            }

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to retrieve all bookings: " . $e->getMessage();
            error_log($this->lastError); // Log the detailed error
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
            $this->lastError = "Failed to get booking: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    public function create(array $data): bool
    {
        $requiredFields = [
            'customer_id',
            'room_id',
            'room_type_id',
            'hotel_id',
            'branch_id',
            'check_in_date',
            'check_out_date',
            'number_of_guests',
            'total_amount'
        ];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, customer_id, room_id, room_type_id, hotel_id, branch_id, check_in_date, check_out_date, status, special_requests, number_of_guests, total_amount) 
            VALUES (:id, :customer_id, :room_id, :room_type_id, :hotel_id, :branch_id, :check_in_date, :check_out_date, :status, :special_requests, :number_of_guests, :total_amount)");

        $params = [
            ':id' => $id,
            ':customer_id' => $data['customer_id'],
            ':room_id' => $data['room_id'],
            ':room_type_id' => $data['room_type_id'],
            ':hotel_id' => $data['hotel_id'],
            ':branch_id' => $data['branch_id'],
            ':check_in_date' => $data['check_in_date'],
            ':check_out_date' => $data['check_out_date'],
            ':status' => $data['status'] ?? 'pending',
            ':special_requests' => $data['special_requests'] ?? null,
            ':number_of_guests' => $data['number_of_guests'],
            ':total_amount' => $data['total_amount'],
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
                'customer_id',
                'room_id',
                'room_type_id',
                'hotel_id',
                'branch_id',
                'check_in_date',
                'check_out_date',
                'status',
                'special_requests',
                'number_of_guests',
                'total_amount'
            ])) {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }

        $fields[] = "updated_at = CURRENT_TIMESTAMP";

        $sql = "UPDATE {$this->table_name} SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $this->executeQuery($stmt, $params);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update booking: " . $e->getMessage();
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
