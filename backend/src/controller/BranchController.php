<?php
require_once __DIR__ . '/../model/Branch.php';

/**
 * BranchController Class
 * 
 * Handles business logic and API responses for branches.
 */
class BranchController
{
    private Branch $branchModel;

    public function __construct()
    {
        $this->branchModel = new Branch();
    }

    public function getAllBranchesByHotel(string $hotel_id): string
    {
        $branches = $this->branchModel->getAllByHotel($hotel_id);
        return json_encode([
            'status' => true,
            'data' => $branches
        ]);
    }

    public function getBranchById(string $id): string
    {
        $branch = $this->branchModel->getById($id);

        if (!$branch) {
            return json_encode([
                'status' => false,
                'message' => 'Branch not found'
            ]);
        }

        return json_encode([
            'status' => true,
            'data' => $branch
        ]);
    }

    public function createBranch(array $data): string
    {
        if ($this->branchModel->create($data)) {
            return json_encode([
                'status' => true,
                'message' => 'Branch created successfully'
            ]);
        }

        return json_encode([
            'status' => false,
            'message' => 'Failed to create branch',
            'error' => $this->branchModel->getLastError()
        ]);
    }

    public function updateBranch(string $id, array $data): string
    {
        if ($this->branchModel->update($id, $data)) {
            return json_encode([
                'status' => true,
                'message' => 'Branch updated successfully'
            ]);
        }

        return json_encode([
            'status' => false,
            'message' => 'Failed to update branch',
            'error' => $this->branchModel->getLastError()
        ]);
    }

    public function deleteBranch(string $id): string
    {
        if ($this->branchModel->delete($id)) {
            return json_encode([
                'status' => true,
                'message' => 'Branch deleted successfully'
            ]);
        }

        return json_encode([
            'status' => false,
            'message' => 'Failed to delete branch',
            'error' => $this->branchModel->getLastError()
        ]);
    }
}
