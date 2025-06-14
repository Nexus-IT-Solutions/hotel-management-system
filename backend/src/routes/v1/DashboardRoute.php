<?php
require_once __DIR__ . '/../../controller/DashboardController.php';

return function ($app): void {
    $dashboardController = new DashboardController();

    // Get dashboard statistics
    $app->get('/v1/dashboard/stats', function ($request, $response) use ($dashboardController) {
        $result = $dashboardController->getDashboardStats();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
