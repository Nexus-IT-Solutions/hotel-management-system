
<?php 
return function($app): void{ 
    // Define API routes here. This file is responsible for registering all API endpoints.
    // Example placeholder route:
    $app->get('/placeholder', function ($request, $response, $args) {
        // return $response->withJson();
        $data = ['message' => 'This is a placeholder route.'];
        $payload = json_encode($data);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
        });
    };
