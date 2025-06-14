<?php
require_once __DIR__ . '/../../controller/EmergencyContactController.php';

return function ($app): void {
    $contactController = new EmergencyContactController();

    // Get all emergency contacts for a specific customer
    $app->get('/v1/emergency-contacts/customer/{customer_id}', function ($request, $response, $args) use ($contactController) {
        $customer_id = $args['customer_id'] ?? '';
        $result = $contactController->getAllByCustomer($customer_id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get emergency contact by ID
    $app->get('/v1/emergency-contacts/{id}', function ($request, $response, $args) use ($contactController) {
        $id = $args['id'] ?? '';
        $result = $contactController->getEmergencyContactById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create new emergency contact
    $app->post('/v1/emergency-contacts', function ($request, $response) use ($contactController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $contactController->createEmergencyContact($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete an emergency contact
    $app->delete('/v1/emergency-contacts/{id}', function ($request, $response, $args) use ($contactController) {
        $id = $args['id'] ?? '';
        $result = $contactController->deleteEmergencyContact($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
