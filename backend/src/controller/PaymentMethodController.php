<?php
require_once __DIR__ . '/../models/PaymentMethod.php';

/**
 * PaymentMethodController Class
 * 
 * Handles business logic and interaction with the PaymentMethod model.
 */
class PaymentMethodController
{
    private PaymentMethod $paymentMethod;

    public function __construct()
    {
        $this->paymentMethod = new PaymentMethod();
    }

    public function getAllByHotel(string $hotel_id): string
    {
        $methods = $this->paymentMethod->getAllByHotel($hotel_id);
        return json_encode([
            'status' => 'success',
            'payment_methods' => $methods
        ], JSON_PRETTY_PRINT);
    }

    public function getAllByBranch(string $branch_id): string
    {
        $methods = $this->paymentMethod->getAllByBranch($branch_id);
        return json_encode([
            'status' => 'success',
            'payment_methods' => $methods
        ], JSON_PRETTY_PRINT);
    }

    public function getById(string $id): string
    {
        $method = $this->paymentMethod->getById($id);
        return json_encode([
            'status' => $method ? 'success' : 'error',
            'payment_method' => $method,
            'message' => !$method ? 'Payment method not found' : null
        ], JSON_PRETTY_PRINT);
    }

    public function create(array $data): string
    {
        $success = $this->paymentMethod->create($data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Payment method created successfully' : $this->paymentMethod->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    public function update(string $id, array $data): string
    {
        $success = $this->paymentMethod->update($id, $data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Payment method updated successfully' : $this->paymentMethod->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    public function delete(string $id): string
    {
        $success = $this->paymentMethod->delete($id);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Payment method deleted successfully' : $this->paymentMethod->getLastError()
        ], JSON_PRETTY_PRINT);
    }
}
