<?php
require_once __DIR__ . '/../model/Room.php';
/**
 * RoomController
 * 
 * Handles HTTP requests related to rooms.
 */
class RoomController
{
    private $roomModel;

    public function __construct()
    {
        $this->roomModel = new Room();
    }
    /**
     * Get all rooms in a specific branch
     */
    public function getAllBranchRooms(string $branchId): string
    {
        $rooms = $this->roomModel->getAllBranchRooms($branchId);
        return json_encode([
            'status' => !empty($rooms) ? 'success' : 'error',
            'branchRooms' => $rooms,
            'message' => !empty($rooms) ? null : 'No rooms found for this branch'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get room availability 
     * @param string $branchId
     * 
     */
    public function getRoomAvailability(string $branchId): string
    {
        $availability = $this->roomModel->getRoomAvailability($branchId);
        return json_encode([
            'status' => !empty($availability) ? 'success' : 'error',
            'roomAvailability' => $availability,
            'message' => !empty($availability) ? null : 'No room availability found for this branch'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get a room by ID
     */
    public function getRoomById(string $id): string
    {
        $room = $this->roomModel->getById($id);
            return json_encode([
                'status' => !empty($room) ? 'success' : 'error',
                'room' => $room,
                'message' => !empty($room) ? null : 'Room not found'
            ], JSON_PRETTY_PRINT);
    }

    /**
     * Create a new room
     */
    public function createRoom(array $data): string
    {
        $success = $this->roomModel->create($data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Room created successfully' : $this->roomModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Update an existing room
     */
    public function updateRoom(string $id, array $data): string
    {
        $success = $this->roomModel->update($id, $data);
        if (!$success) {
            return json_encode([
                'status' => 'error',
                'message' => $this->roomModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }

        return json_encode([
            'status' => 'success',
            'message' => 'Room updated successfully'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Delete a room
     */
    public function deleteRoom(string $id): string
    {
        $success = $this->roomModel->delete($id);

        if (!$success) {
            return json_encode([
                'status' => 'error',
                'message' => $this->roomModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }

        return json_encode([
            'status' => 'success',
            'message' => 'Room deleted successfully'
        ], JSON_PRETTY_PRINT);
    }
}
