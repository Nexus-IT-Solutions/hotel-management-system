<?php
require_once __DIR__ . '/../../controller/HotelController.php';

return function ($app): void {
    $hotelController = new HotelController();

    // Get all hotels
    $app->get('/v1/hotels', function ($request, $response) use ($hotelController) {
        $result = $hotelController->getAllHotels();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get hotel by ID
    $app->get('/v1/hotels/{id}', function ($request, $response, $args) use ($hotelController) {
        $id = $args['id'] ?? '';
        $result = $hotelController->getHotelById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new hotel
    $app->post('/v1/hotels', function ($request, $response) use ($hotelController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $hotelController->createHotel($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing hotel
    $app->put('/v1/hotels/{id}', function ($request, $response, $args) use ($hotelController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $hotelController->updateHotel($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a hotel
    $app->delete('/v1/hotels/{id}', function ($request, $response, $args) use ($hotelController) {
        $id = $args['id'] ?? '';
        $result = $hotelController->deleteHotel($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
