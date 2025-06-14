<?php
require_once __DIR__ . '/../model/Payment.php';

class PaymentController
{
    private Payment $paymentModel;

    public function __construct()
    {
        $this->paymentModel = new Payment();
    }

    public function getPaymentById(string $id): string
    {
        $payment = $this->paymentModel->getById($id);
        return json_encode([
            'status' => $payment ? 'success' : 'error',
            'payment' => $payment,
            'message' => !$payment ? 'Payment not found' : null
        ], JSON_PRETTY_PRINT);
    }

    public function getPaymentsByBooking(string $booking_id): string
    {
        $payments = $this->paymentModel->getAllByBooking($booking_id);
        return json_encode([
            'status' => true,
            'data' => $payments
        ]);
    }

    public function createPayment(array $data): string
    {
        if ($this->paymentModel->create($data)) {
            return json_encode([
                'status' => true,
                'message' => 'Payment recorded successfully'
            ]);
        }

        return json_encode([
            'status' => false,
            'message' => 'Failed to record payment',
            'error' => $this->paymentModel->getLastError()
        ]);
    }

    public function deletePayment(string $id): string
    {
        if ($this->paymentModel->delete($id)) {
            return json_encode([
                'status' => true,
                'message' => 'Payment deleted successfully'
            ]);
        }

        return json_encode([
            'status' => false,
            'message' => 'Failed to delete payment',
            'error' => $this->paymentModel->getLastError()
        ]);
    }
}
