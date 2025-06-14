<?php
require_once __DIR__ . '/../../controller/CustomerController.php';

return function ($app): void {
    $customerController = new CustomerController();

    // Get all customers
    $app->get('/v1/customers', function ($request, $response) use ($customerController) {
        $result = $customerController->getAllCustomers();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get customer summary
    $app->get('/v1/customers/summary', function ($request, $response) use ($customerController) {
        $result = $customerController->getCustomersSummary();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get a single customer by ID
    $app->get('/v1/customers/{id}', function ($request, $response, $args) use ($customerController) {
        $id = $args['id'] ?? '';
        $result = $customerController->getCustomerById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new customer
    $app->post('/v1/customers', function ($request, $response) use ($customerController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $customerController->createCustomer($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing customer
    $app->patch('/v1/customers/{id}', function ($request, $response, $args) use ($customerController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $customerController->updateCustomer($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a customer
    $app->delete('/v1/customers/{id}', function ($request, $response, $args) use ($customerController) {
        $id = $args['id'] ?? '';
        $result = $customerController->deleteCustomer($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
