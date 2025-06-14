<?php
require_once __DIR__ . '/../../controller/AuthController.php';

return function ($app): void{
    $authController = new AuthController();

    $app->post('/v1/auth/login', function ($request, $response, $args) use ($authController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $usernameOrEmail = $data['usernameOrEmail'] ?? '';
        $password = $data['password'] ?? '';
        $result = $authController->login($usernameOrEmail, $password);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($result['code']);
    });

    // Forgot Password Route
    $app->post('/v1/auth/forgot-password', function ($request, $response) use ($authController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $email = $data['email'] ?? '';
        $result = $authController->forgotPassword($email);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Validate OTP Route
    $app->post('/v1/auth/validate-otp', function ($request, $response) use ($authController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $otp = $data['otp'] ?? '';
        $result = $authController->validateOtp($otp);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Reset Password Route
    $app->post('/v1/auth/reset-password', function ($request, $response, $args) use ($authController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $otp = $data['otp'] ?? '';
        $newPassword = $data['newPassword'] ?? '';
        $result = $authController->resetPassword($otp, $newPassword);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    });
};