<?php
require_once __DIR__ . '/../../controller/UserController.php';

return function ($app): void{
    $userController = new UserController();

    // Get all users
    $app->get('/v1/users', function ($request, $response) use ($userController) {
        $result = $userController->getProfile();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get all branch users
    $app->get('/v1/users/branch/{branchId}', function ($request, $response, $args) use ($userController) {
        $branchId = $args['branchId'] ?? '';
        $result = $userController->getBranchUsers($branchId);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get user by ID
    $app->get('/v1/users/{id}', function ($request, $response) use ($userController) {
        $id = $args['id'] ?? '';
        $result = $userController->getUserById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get user by email
    $app->get('/v1/users/email/{email}', function ($request, $response, $args) use ($userController) {
        $email = $args['email'] ?? '';
        $result = $userController->getUserByEmail($email);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get user by phone
    $app->get('/v1/users/phone/{phone}', function ($request, $response, $args) use ($userController) {
        $phone = $args['phone'] ?? '';
        $result = $userController->getUserByPhone($phone);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get user by username
    $app->get('/v1/users/username/{username}', function ($request, $response, $args) use ($userController) {
        $username = $args['username'] ?? '';
        $result = $userController->getUserByUsername($username);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get user by identifier (username, email, or phone)
    $app->get('/v1/users/identifier/{identifier}', function ($request, $response, $args) use ($userController) {
        $identifier = $args['identifier'] ?? '';
        $result = $userController->getUserByIdentifier($identifier);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new user
    $app->post('/v1/users', function ($request, $response) use ($userController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $userController->createUser($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update user by ID
    $app->patch('/v1/users/{id}', function ($request, $response, $args) use ($userController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $userController->updateUser($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete user by ID
    $app->delete('/v1/users/{id}', function ($request, $response, $args) use ($userController) {
        $id = $args['id'] ?? '';
        $result = $userController->deleteUser($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

};
