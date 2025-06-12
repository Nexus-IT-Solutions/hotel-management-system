<?php 
return function($app): void{ 
    // Define API routes here. This file is responsible for registering all API endpoints.
    // Get the request URI
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';

    // Map route prefixes to their router files
    $routeMap = [
        '/v1/auth' => __DIR__ . '/v1/AuthRoute.php',
        '/v1/users' => __DIR__ . '/v1/UserRoute.php',
        '/v1/hotels' => __DIR__ . '/v1/HotelRoute.php',
        'v1/room-types' => __DIR__ . '/v1/RoomTypeRoute.php',
        '/v1/rooms' => __DIR__ . '/v1/RoomRoute.php',
        '/v1/customers' => __DIR__ . '/v1/CustomerRoute.php',
        '/v1/check-outs' => __DIR__ . '/v1/CheckOutRoute.php',
        '/v1/check-ins' => __DIR__ . '/v1/CheckInRoute.php',
        '/v1/bookings' => __DIR__ . '/v1/BookingRoute.php',
        '/v1/emergency-contacts' => __DIR__ . '/v1/EmergencyContactRoute.php',
        '/v1/payments' => __DIR__ . '/v1/PaymentRoute.php',
        '/v1/payment-methods' => __DIR__ . '/v1/PaymentMethodRoute.php',
        'v1/settings' => __DIR__ . '/v1/SettingsRoute.php',
        // 'v1/notifications' => __DIR__ . '/v1/NotificationRoute.php'

        // Add more routes as needed
    ];

    $loaded = false;
    // Check if the request matches any of our defined prefixes
    foreach ($routeMap as $prefix => $routerFile) {
        if (strpos($requestUri, $prefix) === 0) {
            // Load only the matching router
            if (file_exists($routerFile)) {
                (require_once $routerFile)($app);
                $loaded = true;
            }
        }
    }

    // If no specific router was loaded, load all routers as fallback
    if (!$loaded) {
        foreach ($routeMap as $routerFile) {
            if (file_exists($routerFile)) {
                (require_once $routerFile)($app);
            }
        }
    };

};
