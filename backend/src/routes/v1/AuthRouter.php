<?php
require_once __DIR__ . '/../../controller/AuthController.php';

return function ($app): void{
    $authController = new AuthController();

    $app->post('/v1/auth/login', function ($request, $response, $args) use ($authController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $usernameOrEmail = $data['usernameOrEmail'] ?? '';
        $password = $data['password'] ?? '';

        $result = $authController->login($usernameOrEmail, $password);
        $response->getBody()->write($result)
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
       
    });
};