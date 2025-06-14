<?php
require_once __DIR__ . '/../../controller/CheckInController.php';

return function ($app): void {
    $checkInController = new CheckInController();

    // Get all check-ins
    $app->get('/v1/check-ins', function ($request, $response) use ($checkInController) {
        $result = $checkInController->getAllCheckIns();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get a single check-in by ID
    $app->get('/v1/check-ins/{id}', function ($request, $response, $args) use ($checkInController) {
        $id = $args['id'] ?? '';
        $result = $checkInController->getCheckInById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new check-in
    $app->post('/v1/check-ins', function ($request, $response) use ($checkInController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $checkInController->createCheckIn($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a check-in
    $app->delete('/v1/check-ins/{id}', function ($request, $response, $args) use ($checkInController) {
        $id = $args['id'] ?? '';
        $result = $checkInController->deleteCheckIn($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
