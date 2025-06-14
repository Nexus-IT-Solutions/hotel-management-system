<?php
require_once __DIR__ . '/../model/RoomType.php';

/**
 * RoomTypeController
 * 
 * Handles HTTP requests related to room types.
 */
class RoomTypeController
{
    private $roomTypeModel;

    public function __construct()
    {
        $this->roomTypeModel = new RoomType();
    }

    /**
     * Get all room types for a specific hotel
     */
    public function getAllBranchRoomTypes(string $branch_id): string
    {
        if (empty($branch_id)) {
            return json_encode([
                'status' => 'error',
                'message' => 'Branch ID is required'
            ], JSON_PRETTY_PRINT);
        }

        $roomTypes = $this->roomTypeModel->getAllBranchRoomTypes($branch_id);
        return json_encode([
            'status' => 'success',
            'data' => $roomTypes
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get a room type by ID
     */
    public function getRoomTypeById(string $id): string
    {
        $roomType = $this->roomTypeModel->getById($id);

        if (!$roomType) {
            return json_encode([
                'status' => 'error',
                'message' => 'Room type not found'
            ], JSON_PRETTY_PRINT);
        }

        return json_encode([
            'status' => 'success',
            'data' => $roomType
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Create a new room type
     */
    public function createRoomType(array $data): string
    {
        $success = $this->roomTypeModel->create($data);

        if (!$success) {
            return json_encode([
                'status' => 'error',
                'message' => $this->roomTypeModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }

        return json_encode([
            'status' => 'success',
            'message' => 'Room type created successfully'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Update an existing room type
     */
    public function updateRoomType(string $id, array $data): string
    {
        $success = $this->roomTypeModel->update($id, $data);

        if (!$success) {
            return json_encode([
                'status' => 'error',
                'message' => $this->roomTypeModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }

        return json_encode([
            'status' => 'success',
            'message' => 'Room type updated successfully'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Delete a room type
     */
    public function deleteRoomType(string $id): string
    {
        $success = $this->roomTypeModel->delete($id);

        if (!$success) {
            return json_encode([
                'status' => 'error',
                'message' => $this->roomTypeModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }

        return json_encode([
            'status' => 'success',
            'message' => 'Room type deleted successfully'
        ], JSON_PRETTY_PRINT);
    }
}
