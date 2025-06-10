<?php
require_once __DIR__ . '/../../controller/AuthController.php';

return function ($app): void{
    $authController = new AuthController();

    $app->post('/v1/auth/login', function ($request, $response, $args) use ($authController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $usernameOrEmail = $data['usernameOrEmail'] ?? '';
        $password = $data['password'] ?? '';

        $result = $authController->login($usernameOrEmail, $password);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Forgot Password Route
    $app->post('/v1/auth/forgot-password', function ($request, $response) use ($authController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $emailOrPhone = $data['emailOrPhone'] ?? '';
        $result = $authController->forgotPassword($emailOrPhone);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Reset Password Route
    $app->post('/v1/auth/reset-password/{token}', function ($request, $response, $args) use ($authController) {
        $token = $args['token'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $newPassword = $data['newPassword'] ?? '';
        $result = $authController->resetPassword($token, $newPassword);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};