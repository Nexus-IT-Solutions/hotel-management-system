<?php
require_once __DIR__ . '/../model/EmergencyContact.php';

/**
 * EmergencyContactController Class
 * 
 * Handles business logic and API responses for emergency contacts.
 */
class EmergencyContactController
{
    private EmergencyContact $contactModel;

    public function __construct()
    {
        $this->contactModel = new EmergencyContact();
    }

    public function getEmergencyContactById(string $id): string
    {
        $contact = $this->contactModel->getById($id);
        if (!$contact) {
            return json_encode([
                'status' => false,
                'message' => 'Emergency contact not found'
            ]);
        }

        return json_encode([
            'status' => true,
            'data' => $contact
        ]);
    }

    public function getAllByCustomer(string $customer_id): string
    {
        $contacts = $this->contactModel->getAllByCustomer($customer_id);
        return json_encode([
            'status' => true,
            'data' => $contacts
        ]);
    }

    public function createEmergencyContact(array $data): string
    {
        if ($this->contactModel->create($data)) {
            return json_encode([
                'status' => true,
                'message' => 'Emergency contact created successfully'
            ]);
        }

        return json_encode([
            'status' => false,
            'message' => 'Failed to create emergency contact',
            'error' => $this->contactModel->getLastError()
        ]);
    }

    public function deleteEmergencyContact(string $id): string
    {
        if ($this->contactModel->delete($id)) {
            return json_encode([
                'status' => true,
                'message' => 'Emergency contact deleted successfully'
            ]);
        }

        return json_encode([
            'status' => false,
            'message' => 'Failed to delete emergency contact',
            'error' => $this->contactModel->getLastError()
        ]);
    }
}
