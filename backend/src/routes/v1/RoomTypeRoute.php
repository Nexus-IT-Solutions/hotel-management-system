<?php
require_once __DIR__ . '/../../controller/RoomTypeController.php';

return function ($app): void {
    $roomTypeController = new RoomTypeController();

    // Get all room types
    $app->get('/v1/room-types', function ($request, $response) use ($roomTypeController) {
        $result = $roomTypeController->getAllRoomTypes();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get room type by ID
    $app->get('/v1/room-types/{id}', function ($request, $response, $args) use ($roomTypeController) {
        $id = $args['id'] ?? '';
        $result = $roomTypeController->getRoomTypeById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new room type
    $app->post('/v1/room-types', function ($request, $response) use ($roomTypeController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $roomTypeController->createRoomType($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing room type
    $app->put('/v1/room-types/{id}', function ($request, $response, $args) use ($roomTypeController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $roomTypeController->updateRoomType($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a room type
    $app->delete('/v1/room-types/{id}', function ($request, $response, $args) use ($roomTypeController) {
        $id = $args['id'] ?? '';
        $result = $roomTypeController->deleteRoomType($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
