<?php
require_once __DIR__ . '/../../controller/CheckOutController.php';

return function ($app): void {
    $checkOutController = new CheckOutController();

    // Get all check-outs
    $app->get('/v1/check-outs', function ($request, $response) use ($checkOutController) {
        $result = $checkOutController->getAllCheckOuts();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get a single check-out by ID
    $app->get('/v1/check-outs/{id}', function ($request, $response, $args) use ($checkOutController) {
        $id = $args['id'] ?? '';
        $result = $checkOutController->getCheckOutById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new check-out
    $app->post('/v1/check-outs', function ($request, $response) use ($checkOutController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $checkOutController->createCheckOut($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing check-out
    $app->patch('/v1/check-outs/{id}', function ($request, $response, $args) use ($checkOutController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $checkOutController->updateCheckOut($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a check-out
    $app->delete('/v1/check-outs/{id}', function ($request, $response, $args) use ($checkOutController) {
        $id = $args['id'] ?? '';
        $result = $checkOutController->deleteCheckOut($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
