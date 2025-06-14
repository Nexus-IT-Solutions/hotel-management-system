<?php
require_once __DIR__ . '/../../controller/BranchController.php';

return function ($app): void {
    $branchController = new BranchController();

    // Get all branches for a specific hotel
    $app->get('/v1/branches/hotel/{hotel_id}', function ($request, $response, $args) use ($branchController) {
        $hotel_id = $args['hotel_id'] ?? '';
        $result = $branchController->getAllBranchesByHotel($hotel_id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get branch by ID
    $app->get('/v1/branches/{id}', function ($request, $response, $args) use ($branchController) {
        $id = $args['id'] ?? '';
        $result = $branchController->getBranchById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new branch
    $app->post('/v1/branches', function ($request, $response) use ($branchController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $branchController->createBranch($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing branch
    $app->patch('/v1/branches/{id}', function ($request, $response, $args) use ($branchController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $branchController->updateBranch($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a branch
    $app->delete('/v1/branches/{id}', function ($request, $response, $args) use ($branchController) {
        $id = $args['id'] ?? '';
        $result = $branchController->deleteBranch($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
