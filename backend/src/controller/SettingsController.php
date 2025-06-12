<?php
require_once __DIR__ . '/../model/Settings.php';

/**
 * SettingController
 * Handles HTTP requests related to settings.
 */
class SettingsController
{
    private $settingModel;

    public function __construct()
    {
        $this->settingModel = new Settings();
    }

    /**
     * Get all settings
     */
    public function getAllSettings(): string
    {
        $settings = $this->settingModel->getAll();
        return json_encode([
            'status' => !empty($settings) ? 'success' : 'error',
            'settings' => $settings,
            'message' => !empty($settings) ? null : 'No settings found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get a single setting by ID
     */
    public function getSettingById(string $id): string
    {
        $setting = $this->settingModel->getById($id);
        return json_encode([
            'status' => !empty($setting) ? 'success' : 'error',
            'setting' => $setting,
            'message' => !empty($setting) ? null : 'Setting not found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Create a new setting
     */
    public function createSetting(array $data): string
    {
        $success = $this->settingModel->create($data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Setting created successfully' : $this->settingModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Update a setting
     */
    public function updateSetting(string $id, array $data): string
    {
        $success = $this->settingModel->update($id, $data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Setting updated successfully' : $this->settingModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Delete a setting
     */
    public function deleteSetting(string $id): string
    {
        $success = $this->settingModel->delete($id);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Setting deleted successfully' : $this->settingModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }
}
