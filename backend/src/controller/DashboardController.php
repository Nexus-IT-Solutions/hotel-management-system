<?php
require_once __DIR__ . '/../model/DashboardService.php';

/**
 * DashboardController
 *
 * Handles HTTP requests related to dashboard statistics.
 */
class DashboardController
{
    private $dashboardService;

    public function __construct()
    {
        $this->dashboardService = new DashboardService();
    }

    /**
     * Get aggregated dashboard statistics.
     *
     * @return string JSON string of dashboard statistics.
     */
    public function getDashboardStats(): string
    {
        $stats = $this->dashboardService->getDashboardStats();

        return json_encode([
            'status' => !empty($stats) ? 'success' : 'error',
            'data' => $stats,
            'message' => !empty($stats) ? 'Dashboard statistics retrieved successfully' : $this->dashboardService->getLastError()
        ], JSON_PRETTY_PRINT);
    }
}
