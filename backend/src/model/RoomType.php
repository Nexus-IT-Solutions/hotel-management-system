<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * RoomType Model Class
 * 
 * Handles all database operations related to the room_types table.
 */
class RoomType
{
    protected $db;
    private $table_name = 'room_types';
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

    public function getAllHotelRoomTypes(string $hotel_id): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE hotel_id = ?");
            if (!$this->executeQuery($stmt, [$hotel_id])) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to get room types: " . $e->getMessage();
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
            $this->lastError = "Failed to get room type: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    public function create(array $data): bool
    {
        $requiredFields = ['hotel_id', 'branch_id', 'name', 'description', 'price_per_night', 'max_occupancy', 'amenities'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();
        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, hotel_id, branch_id, name, description, price_per_night, max_occupancy, amenities) 
            VALUES (:id, :hotel_id, :branch_id, :name, :description, :price_per_night, :max_occupancy, :amenities)");

        $params = [
            ':id' => $id,
            ':hotel_id' => $data['hotel_id'],
            ':branch_id' => $data['branch_id'],
            ':name' => $data['name'],
            ':description' => $data['description'],
            ':price_per_night' => $data['price_per_night'],
            ':max_occupancy' => $data['max_occupancy'],
            ':amenities' => json_encode($data['amenities']),
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
            if (in_array($key, ['hotel_id', 'branch_id', 'name', 'description', 'price_per_night', 'max_occupancy', 'amenities'])) {
                $fields[] = "$key = :$key";
                $params[":$key"] = $key === 'amenities' ? json_encode($value) : $value;
            }
        }

        $fields[] = "updated_at = CURRENT_TIMESTAMP";

        $sql = "UPDATE {$this->table_name} SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $this->executeQuery($stmt, $params);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update room type: " . $e->getMessage();
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
