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

    /**
     * Get room availability
     * @param string $branch_id
     * @return array
     */
    public function getRoomAvailability(string $branchId): array
    {
        try {
            $query = "
                WITH RoomCurrentStatus AS (
                    -- CTE to find the most relevant active booking for each room for today
                    SELECT
                        r.id AS room_id,
                        r.room_number,
                        r.status AS room_physical_status, -- Status from the rooms table
                        rt.name AS room_type_name,
                        rt.max_occupancy,
                        rt.price_per_night,
                        (SELECT b.id
                         FROM bookings b
                         WHERE b.room_id = r.id
                           AND b.branch_id = :branch_id_sub_booking -- Filter bookings by branch_id
                           AND CURDATE() BETWEEN b.check_in_date AND b.check_out_date
                           AND b.status IN ('booked', 'checked_in') -- Only consider confirmed/checked-in bookings
                         -- Prioritize 'checked_in' over 'booked' if multiple active bookings exist
                         ORDER BY FIELD(b.status, 'checked_in', 'booked') DESC, b.created_at DESC
                         LIMIT 1
                        ) AS active_booking_id
                    FROM
                        " . $this->table_name . " r
                    JOIN
                        room_types rt ON r.room_type_id = rt.id
                    WHERE
                        r.branch_id = :branch_id_main_room -- Filter rooms by branch_id
                )
                SELECT
                    rcs.room_number AS number,
                    rcs.room_type_name AS type,
                    rcs.max_occupancy AS capacity,
                    -- The status in the output is derived:
                    CASE
                        WHEN rcs.room_physical_status = 'occupied' THEN 'occupied'
                        WHEN rcs.room_physical_status = 'maintenance' THEN 'maintenance'
                        WHEN rcs.room_physical_status = 'dirty' THEN 'cleaning' -- Mapping 'dirty' to 'cleaning'
                        WHEN rcs.active_booking_id IS NOT NULL THEN
                            -- If room is physically 'available' but has an active booking for today
                            (SELECT
                                CASE
                                    WHEN b.status = 'booked' THEN 'reserved'
                                    WHEN b.status = 'checked_in' THEN 'occupied'
                                    ELSE 'available' -- Fallback, though ideally won't hit this with IN ('booked', 'checked_in')
                                END
                            FROM bookings b WHERE b.id = rcs.active_booking_id)
                        ELSE 'available' -- Room is physically 'available' and has no active bookings for today
                    END AS status,
                    -- Get the guest name if there's an active booking for today
                    CASE
                        WHEN rcs.active_booking_id IS NOT NULL THEN
                            (SELECT c.full_name
                             FROM bookings b
                             JOIN customers c ON b.customer_id = c.id
                             WHERE b.id = rcs.active_booking_id)
                        ELSE NULL
                    END AS guest,
                    rcs.price_per_night AS price
                FROM
                    RoomCurrentStatus rcs
                ORDER BY
                    rcs.room_number ASC;
            ";
            $stmt = $this->db->prepare($query);
            // Bind the branchId parameter to both placeholders in the query
            $stmt->bindParam(':branch_id_main_room', $branchId, PDO::PARAM_INT);
            $stmt->bindParam(':branch_id_sub_booking', $branchId, PDO::PARAM_INT);
            if (!$this->executeQuery($stmt)) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to retrieve room availability for branch " . $branchId . ": " . $e->getMessage();
            error_log($this->lastError); // Log the detailed error
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
    /**
     * Check if a room number already exists in a branch
     * 
     * @param string $branch_id The branch ID to check
     * @param string $room_number The room number to check
     * @return bool True if room number already exists, false otherwise
     */
    public function roomNumberExists(string $branch_id, string $room_number): bool
    {
        try {
            $sql = "SELECT COUNT(*) FROM {$this->table_name} WHERE branch_id = :branch_id AND room_number = :room_number";
            $stmt = $this->db->prepare($sql);
            if (!$this->executeQuery($stmt, [':branch_id' => $branch_id, ':room_number' => $room_number])) {
                return false;
            }
            return (int)$stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            $this->lastError = "Failed to check room number existence: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Check if a hotel ID exists
     * 
     * @param string $hotel_id The hotel ID to check
     * @return bool True if exists, false otherwise
     */
    protected function hotelExists(string $hotel_id): bool
    {
        try {
            $sql = "SELECT COUNT(*) FROM hotels WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            if (!$this->executeQuery($stmt, [':id' => $hotel_id])) {
                return false;
            }
            return (int)$stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            $this->lastError = "Failed to verify hotel: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Check if a branch ID exists
     * 
     * @param string $branch_id The branch ID to check
     * @return bool True if exists, false otherwise
     */
    protected function branchExists(string $branch_id): bool
    {
        try {
            $sql = "SELECT COUNT(*) FROM branches WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            if (!$this->executeQuery($stmt, [':id' => $branch_id])) {
                return false;
            }
            return (int)$stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            $this->lastError = "Failed to verify branch: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Check if a room type ID exists
     * 
     * @param string $room_type_id The room type ID to check
     * @return bool True if exists, false otherwise
     */
    protected function roomTypeExists(string $room_type_id): bool
    {
        try {
            $sql = "SELECT COUNT(*) FROM room_types WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            if (!$this->executeQuery($stmt, [':id' => $room_type_id])) {
                return false;
            }
            return (int)$stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            $this->lastError = "Failed to verify room type: " . $e->getMessage();
            error_log($this->lastError);
            return false;
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

        // Check if room number already exists in this branch
        if ($this->roomNumberExists($data['branch_id'], $data['room_number'])) {
            $this->lastError = "Room number {$data['room_number']} already exists in this branch";
            return false;
        }
        
        // Validate that the hotel_id exists
        if (!$this->hotelExists($data['hotel_id'])) {
            $this->lastError = "Hotel ID {$data['hotel_id']} does not exist.";
            return false;
        }
        
        // Validate branch_id
        if (!$this->branchExists($data['branch_id'])) {
            $this->lastError = "Branch ID {$data['branch_id']} does not exist. ";
            return false;
        }
        
        // Validate room_type_id
        if (!$this->roomTypeExists($data['room_type_id'])) {
            $this->lastError = "Room Type ID {$data['room_type_id']} does not exist. Foreign key constraint violation for 'room_type_id'";
            return false;
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

    public function getLastInsertId(){
        return $this->db->lastInsertId();
    }

    public function update(string $id, array $data): bool
    {
        if (empty($data)) {
            $this->lastError = "No data provided for update.";
            return false;
        }

        // Verify room exists
        $existing = $this->getById($id);
        if (!$existing) {
            $this->lastError = "Room not found.";
            return false;
        }

        // Validate foreign keys and unique constraints if they are provided
        if (isset($data['hotel_id']) && !$this->hotelExists($data['hotel_id'])) {
            $this->lastError = "Hotel ID {$data['hotel_id']} does not exist.";
            return false;
        }

        if (isset($data['branch_id']) && !$this->branchExists($data['branch_id'])) {
            $this->lastError = "Branch ID {$data['branch_id']} does not exist.";
            return false;
        }

        if (isset($data['room_type_id']) && !$this->roomTypeExists($data['room_type_id'])) {
            $this->lastError = "Room Type ID {$data['room_type_id']} does not exist.";
            return false;
        }

        // Check if room number is being updated and if it already exists
        if (isset($data['room_number']) && 
            $data['room_number'] !== $existing['room_number']) {
            $branchId = isset($data['branch_id']) ? $data['branch_id'] : $existing['branch_id'];
            if ($this->roomNumberExists($branchId, $data['room_number'])) {
                $this->lastError = "Room number {$data['room_number']} already exists in this branch.";
                return false;
            }
        }

        // Build update fields
        $fields = [];
        $params = [':id' => $id];

        foreach (['hotel_id', 'branch_id', 'room_type_id', 'room_number', 'floor', 'status'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            $this->lastError = "No valid fields to update.";
            return false;
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
