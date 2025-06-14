<?php
require_once __DIR__ . '/../model/Customer.php';

/**
 * CustomerController
 * 
 * Handles HTTP requests related to customers.
 */
class CustomerController
{
    private $customerModel;

    public function __construct()
    {
        $this->customerModel = new Customer();
    }

    /**
     * Get all customers
     */
    public function getAllCustomers(): string
    {
        $customers = $this->customerModel->getAll();
        return json_encode([
            'status' => !empty($customers) ? 'success' : 'error',
            'customers' => $customers,
            'message' => !empty($customers) ? null : 'No customers found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get customer summary
     */
    public function getCustomersSummary(): string
    {
        $summary = $this->customerModel->getCustomersSummary();
        return json_encode([
            'status' => !empty($summary) ? 'success' : 'error',
            'customersSummary' => $summary,
            'message' => !empty($summary) ? null : 'No customer summary found'
        ], JSON_PRETTY_PRINT);
    }


    /**
     * Get a single customer by ID
     */
    public function getCustomerById(string $id): string
    {
        $customer = $this->customerModel->getById($id);
        return json_encode([
            'status' => !empty($customer) ? 'success' : 'error',
            'customer' => $customer,
            'message' => !empty($customer) ? null : 'Customer not found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Create a new customer
     */
    public function createCustomer(array $data): string
    {
        $success = $this->customerModel->create($data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Customer created successfully' : $this->customerModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Update a customer
     */
    public function updateCustomer(string $id, array $data): string
    {
        $success = $this->customerModel->update($id, $data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Customer updated successfully' : $this->customerModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Delete a customer
     */
    public function deleteCustomer(string $id): string
    {
        $success = $this->customerModel->delete($id);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Customer deleted successfully' : $this->customerModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }
}
