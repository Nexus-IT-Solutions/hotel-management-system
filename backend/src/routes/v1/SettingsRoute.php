<?php
require_once __DIR__ . '/../../controller/SettingsController.php';

return function ($app): void {
    $settingsController = new SettingsController();

    // Get all settings
    $app->get('/v1/settings', function ($request, $response) use ($settingsController) {
        $result = $settingsController->getAllSettings();
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get a single setting by ID
    $app->get('/v1/settings/{id}', function ($request, $response, $args) use ($settingsController) {
        $id = $args['id'] ?? '';
        $result = $settingsController->getSettingById($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Create a new setting
    $app->post('/v1/settings', function ($request, $response) use ($settingsController) {
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $settingsController->createSetting($data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Update an existing setting
    $app->patch('/v1/settings/{id}', function ($request, $response, $args) use ($settingsController) {
        $id = $args['id'] ?? '';
        $data = json_decode($request->getBody()->getContents(), true);
        $result = $settingsController->updateSetting($id, $data);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Delete a setting
    $app->delete('/v1/settings/{id}', function ($request, $response, $args) use ($settingsController) {
        $id = $args['id'] ?? '';
        $result = $settingsController->deleteSetting($id);
        $response->getBody()->write($result);
        return $response->withHeader('Content-Type', 'application/json');
    });
};
