<?php
require_once __DIR__ . '/../../controller/BookingController.php';

return function ($app): void {
    $bookingController = new BookingController();

    // Get all bookings
    $app->get('/v1/bookings/summary', function ($request, $response) use ($bookingController) {
        $result = $bookingController->getAllBookingSummary();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get a single booking by ID
    $app->get('/v1/bookings/{id}', function ($request, $response, $args) use ($bookingController) {
        $id = $args['id'] ?? '';
        $result = $bookingController->getBookingById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get booking by booking code
    $app->get('/v1/bookings/code/{code}', function ($request, $response, $args) use ($bookingController) {
        $code = $args['code'] ?? '';
        $result = $bookingController->getBookingByCode($code);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new booking
    $app->post('/v1/bookings', function ($request, $response) use ($bookingController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $bookingController->createBooking($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing booking
    $app->patch('/v1/bookings/{id}', function ($request, $response, $args) use ($bookingController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $bookingController->updateBooking($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a booking
    $app->delete('/v1/bookings/{id}', function ($request, $response, $args) use ($bookingController) {
        $id = $args['id'] ?? '';
        $result = $bookingController->deleteBooking($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
