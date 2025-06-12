<?php
require_once __DIR__ . '/../../controller/PaymentController.php';

return function ($app): void {
    $paymentController = new PaymentController();

    // Get payment by ID
    $app->get('/v1/payments/{id}', function ($request, $response, $args) use ($paymentController) {
        $id = $args['id'] ?? '';
        $result = $paymentController->getPaymentById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get all payments by booking ID
    $app->get('/v1/payments/booking/{booking_id}', function ($request, $response, $args) use ($paymentController) {
        $booking_id = $args['booking_id'] ?? '';
        $result = $paymentController->getPaymentsByBooking($booking_id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new payment
    $app->post('/v1/payments', function ($request, $response) use ($paymentController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $paymentController->createPayment($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a payment
    $app->delete('/v1/payments/{id}', function ($request, $response, $args) use ($paymentController) {
        $id = $args['id'] ?? '';
        $result = $paymentController->deletePayment($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
