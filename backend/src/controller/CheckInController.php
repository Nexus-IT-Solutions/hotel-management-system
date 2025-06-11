<?php
require_once __DIR__ . '/../model/CheckIn.php';

/**
 * CheckInController
 * Handles HTTP requests related to check-ins.
 */
class CheckInController
{
    private $checkInModel;

    public function __construct()
    {
        $this->checkInModel = new CheckIn();
    }

    /**
     * Get all check-ins
     */
    public function getAllCheckIns(): string
    {
        $checkIns = $this->checkInModel->getAll();
        return json_encode([
            'status' => !empty($checkIns) ? 'success' : 'error',
            'check_ins' => $checkIns,
            'message' => !empty($checkIns) ? null : 'No check-ins found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get a single check-in by ID
     */
    public function getCheckInById(string $id): string
    {
        $checkIn = $this->checkInModel->getById($id);
        return json_encode([
            'status' => !empty($checkIn) ? 'success' : 'error',
            'check_in' => $checkIn,
            'message' => !empty($checkIn) ? null : 'Check-in not found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Create a new check-in
     */
    public function createCheckIn(array $data): string
    {
        $success = $this->checkInModel->create($data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Check-in created successfully' : $this->checkInModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Delete a check-in
     */
    public function deleteCheckIn(string $id): string
    {
        $success = $this->checkInModel->delete($id);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Check-in deleted successfully' : $this->checkInModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }
}
