<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * Room Model Class
 * 
 * Handles all database operations related to the `rooms` table.
 */
class Room
{
    protected $db;
    private $table_name = 'rooms';
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

    public function getAllBranchRooms(string $branch_id): array
    {
        try {
            $sql = "SELECT 
                        r.*, 
                        rt.id AS room_type_id, rt.name AS room_type_name, rt.description AS room_type_description, 
                        rt.price_per_night, rt.max_occupancy, rt.amenities
                    FROM {$this->table_name} r
                    LEFT JOIN room_types rt ON r.room_type_id = rt.id
                    WHERE r.branch_id = ?";
            $stmt = $this->db->prepare($sql);
            if (!$this->executeQuery($stmt, [$branch_id])) {
                return [];
            }
            $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Group by room_type_id
            $grouped = [];
            foreach ($rooms as $room) {
                $typeId = $room['room_type_id'];
                if (!isset($grouped[$typeId])) {
                    $grouped[$typeId] = [
                        'room_type' => [
                            'id' => $room['room_type_id'],
                            'name' => $room['room_type_name'],
                            'description' => $room['room_type_description'],
                            'price_per_night' => $room['price_per_night'],
                            'max_occupancy' => $room['max_occupancy'],
                            'amenities' => $room['amenities'] ? json_decode($room['amenities'], true) : [],
                        ],
                        'rooms' => []
                    ];
                }
                // Remove duplicated room_type fields from room
                unset($room['room_type_name'], $room['room_type_description'], $room['price_per_night'], $room['max_occupancy'], $room['amenities']);
                $grouped[$typeId]['rooms'][] = $room;
            }
            // Re-index as array
            return array_values($grouped);
        } catch (PDOException $e) {
            $this->lastError = "Failed to get rooms: " . $e->getMessage();
            error_log($this->lastError);
            return [];
        }
    }

    public function getById(string $id): ?array
    {
        try {
            $sql = "SELECT 
                        r.*, 
                        rt.id AS room_type_id, rt.name AS room_type_name, rt.description AS room_type_description, 
                        rt.price_per_night, rt.max_occupancy, rt.amenities
                    FROM {$this->table_name} r
                    LEFT JOIN room_types rt ON r.room_type_id = rt.id
                    WHERE r.id = ?";
            $stmt = $this->db->prepare($sql);
            if (!$this->executeQuery($stmt, [$id])) {
                return null;
            }
            $room = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$room) return null;

            // Attach room_type as nested object
            $room['room_type'] = [
                'id' => $room['room_type_id'],
                'name' => $room['room_type_name'],
                'description' => $room['room_type_description'],
                'price_per_night' => $room['price_per_night'],
                'max_occupancy' => $room['max_occupancy'],
                'amenities' => $room['amenities'] ? json_decode($room['amenities'], true) : [],
            ];
            unset($room['room_type_id'], $room['room_type_name'], $room['room_type_description'], $room['price_per_night'], $room['max_occupancy'], $room['amenities']);
            return $room;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get room: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    public function create(array $data): bool
    {
        $requiredFields = ['hotel_id', 'branch_id', 'room_type_id', 'room_number', 'floor', 'status'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, hotel_id, branch_id, room_type_id, room_number, floor, status) 
            VALUES (:id, :hotel_id, :branch_id, :room_type_id, :room_number, :floor, :status)");

        $params = [
            ':id' => $id,
            ':hotel_id' => $data['hotel_id'],
            ':branch_id' => $data['branch_id'],
            ':room_type_id' => $data['room_type_id'],
            ':room_number' => $data['room_number'],
            ':floor' => $data['floor'],
            ':status' => $data['status'],
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
            if (in_array($key, ['hotel_id', 'branch_id', 'room_type_id', 'room_number', 'floor', 'status'])) {
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
            $this->lastError = "Failed to update room: " . $e->getMessage();
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
