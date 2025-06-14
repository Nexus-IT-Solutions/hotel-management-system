<?php
require_once __DIR__ . '/../../controller/PaymentMethodController.php';

return function ($app): void {
    $paymentMethodController = new PaymentMethodController();

    // Get all payment methods by hotel
    $app->get('/v1/payment-methods/hotel/{hotel_id}', function ($request, $response, $args) use ($paymentMethodController) {
        $hotel_id = $args['hotel_id'] ?? '';
        $result = $paymentMethodController->getAllByHotel($hotel_id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get all payment methods by branch
    $app->get('/v1/payment-methods/branch/{branch_id}', function ($request, $response, $args) use ($paymentMethodController) {
        $branch_id = $args['branch_id'] ?? '';
        $result = $paymentMethodController->getAllByBranch($branch_id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get payment method by ID
    $app->get('/v1/payment-methods/{id}', function ($request, $response, $args) use ($paymentMethodController) {
        $id = $args['id'] ?? '';
        $result = $paymentMethodController->getById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new payment method
    $app->post('/v1/payment-methods', function ($request, $response) use ($paymentMethodController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $paymentMethodController->create($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing payment method
    $app->patch('/v1/payment-methods/{id}', function ($request, $response, $args) use ($paymentMethodController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $paymentMethodController->update($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a payment method
    $app->delete('/v1/payment-methods/{id}', function ($request, $response, $args) use ($paymentMethodController) {
        $id = $args['id'] ?? '';
        $result = $paymentMethodController->delete($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};