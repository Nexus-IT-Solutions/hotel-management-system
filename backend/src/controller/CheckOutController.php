<?php
require_once __DIR__ . '/../model/CheckOut.php';

/**
 * CheckOutController
 * Handles HTTP requests related to check-outs.
 */
class CheckOutController
{
    private $checkOutModel;

    public function __construct()
    {
        $this->checkOutModel = new CheckOut();
    }

    /**
     * Get all check-outs
     */
    public function getAllCheckOuts(): string
    {
        $checkOuts = $this->checkOutModel->getAll();
        return json_encode([
            'status' => !empty($checkOuts) ? 'success' : 'error',
            'check_outs' => $checkOuts,
            'message' => !empty($checkOuts) ? null : 'No check-outs found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get a single check-out by ID
     */
    public function getCheckOutById(string $id): string
    {
        $checkOut = $this->checkOutModel->getById($id);
        return json_encode([
            'status' => !empty($checkOut) ? 'success' : 'error',
            'check_out' => $checkOut,
            'message' => !empty($checkOut) ? null : 'Check-out not found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Create a new check-out
     */
    public function createCheckOut(array $data): string
    {
        $success = $this->checkOutModel->create($data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Check-out created successfully' : $this->checkOutModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Update a check-out
     */
    public function updateCheckOut(string $id, array $data): string
    {
        $success = $this->checkOutModel->update($id, $data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Check-out updated successfully' : $this->checkOutModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Delete a check-out
     */
    public function deleteCheckOut(string $id): string
    {
        $success = $this->checkOutModel->delete($id);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Check-out deleted successfully' : $this->checkOutModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }
}
