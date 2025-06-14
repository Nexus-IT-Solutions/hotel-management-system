<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * DashboardService Class
 *
 * Fetches pre-calculated and pre-formatted dashboard statistics from a database view.
 * All calculation and string formatting logic resides within the SQL view.
 */
class DashboardService
{
    protected $db;
    private $lastError = '';

    public function __construct()
    {
        try {
            $database = new Database();
            $this->db = $database->getConnection();
        } catch (PDOException $e) {
            $this->lastError = "Database connection failed: " . $e->getMessage();
            error_log($this->lastError);
            throw $e;
        }
    }

    public function getLastError(): string
    {
        return $this->lastError;
    }

    /**
     * Retrieves all pre-calculated dashboard statistics from the database view.
     *
     * @return array The array of statistics, or an empty array on failure.
     */
    public function getDashboardStats(): array
    {
        try {
            // Query the single dashboard statistics view
            $stmt = $this->db->prepare("SELECT * FROM dashboard_stats_summary");

            if (!$stmt->execute()) {
                $this->lastError = "Failed to fetch data from dashboard_stats_summary view. SQL error: " . implode(" | ", $stmt->errorInfo());
                error_log($this->lastError);
                return [];
            }

            $statsRaw = $stmt->fetch(PDO::FETCH_ASSOC);

            // Provide default/empty data if the view returns no results (e.g., empty database or no relevant data yet)
            // This ensures a consistent structure even when there's no data.
            if (!$statsRaw) {
                return [
                    ["title" => "Today's Bookings", "value" => "0", "change" => "0%", "description" => "0 confirmed, 0 pending"],
                    ["title" => "Available Rooms", "value" => "0", "change" => "0 from yesterday", "description" => "Out of 0 total rooms"],
                    ["title" => "Today's Revenue", "value" => "$0.00", "change" => "0%", "description" => "Target: $15,000"],
                    ["title" => "Today's Check-ins", "value" => "0", "change" => "0%", "description" => "Based on today's confirmed arrivals"]
                ];
            }

            // Map the view's output directly to the desired JSON structure
            // All 'value', 'change', and 'description' fields are directly from the view.
            return [
                [
                    "title" => "Today's Bookings",
                    "value" => $statsRaw['bookings_value'],
                    "change" => $statsRaw['bookings_change'],
                    "description" => $statsRaw['bookings_description']
                ],
                [
                    "title" => "Available Rooms",
                    "value" => $statsRaw['available_rooms_value'],
                    "change" => $statsRaw['available_rooms_change'],
                    "description" => $statsRaw['available_rooms_description']
                ],
                [
                    "title" => "Today's Revenue",
                    "value" => $statsRaw['revenue_value'],
                    "change" => $statsRaw['revenue_change'],
                    "description" => $statsRaw['revenue_description']
                ],
                [
                    "title" => "Today's Check-ins",
                    "value" => $statsRaw['check_ins_value'],
                    "change" => $statsRaw['check_ins_change'],
                    "description" => $statsRaw['check_ins_description']
                ]
            ];
        } catch (Exception $e) {
            $this->lastError = "An unexpected error occurred while compiling dashboard stats: " . $e->getMessage();
            error_log($this->lastError);
            return [];
        }
    }

    // The calculatePercentageChange method has been removed as all such logic is now in the SQL view.
}
