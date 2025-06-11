<?php
require_once __DIR__ . '/../../controller/SettingController.php';

return function ($app): void {
    $settingController = new SettingController();

    // Get all settings
    $app->get('/v1/settings', function ($request, $response) use ($settingController) {
        $result = $settingController->getAllSettings();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get a single setting by ID
    $app->get('/v1/settings/{id}', function ($request, $response, $args) use ($settingController) {
        $id = $args['id'] ?? '';
        $result = $settingController->getSettingById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new setting
    $app->post('/v1/settings', function ($request, $response) use ($settingController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $settingController->createSetting($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing setting
    $app->patch('/v1/settings/{id}', function ($request, $response, $args) use ($settingController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $settingController->updateSetting($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a setting
    $app->delete('/v1/settings/{id}', function ($request, $response, $args) use ($settingController) {
        $id = $args['id'] ?? '';
        $result = $settingController->deleteSetting($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
