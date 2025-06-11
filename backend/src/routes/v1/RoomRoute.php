<?php
require_once __DIR__ . '/../../controller/RoomController.php';

return function ($app): void {
    $roomController = new RoomController();

    // Get all rooms by branch ID
    $app->get('/v1/branches/{branch_id}/rooms', function ($request, $response, $args) use ($roomController) {
        $branchId = $args['branch_id'] ?? '';
        $result = $roomController->getAllBranchRooms($branchId);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get room by ID
    $app->get('/v1/rooms/{id}', function ($request, $response, $args) use ($roomController) {
        $id = $args['id'] ?? '';
        $result = $roomController->getRoomById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new room
    $app->post('/v1/rooms', function ($request, $response) use ($roomController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $roomController->createRoom($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing room
    $app->patch('/v1/rooms/{id}', function ($request, $response, $args) use ($roomController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $roomController->updateRoom($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a room
    $app->delete('/v1/rooms/{id}', function ($request, $response, $args) use ($roomController) {
        $id = $args['id'] ?? '';
        $result = $roomController->deleteRoom($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
