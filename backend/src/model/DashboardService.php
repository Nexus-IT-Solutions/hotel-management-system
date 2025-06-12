<?php
require_once __DIR__ . '/../config/Database.php'; // Still needs the Database connection

/**
 * DashboardService Class
 *
 * Directly queries the database to aggregate data for dashboard statistics.
 * Acts as a self-contained "model" for dashboard information.
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

    protected function executeQuery(\PDOStatement $stmt, array $params = [], bool $fetch = false)
    {
        try {
            $stmt->execute($params);
            if ($fetch) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }
            return true;
        } catch (PDOException $e) {
            $this->lastError = "Query execution failed: " . $e->getMessage();
            error_log($this->lastError . " - SQL: " . $stmt->queryString);
            return false;
        }
    }

    /**
     * Gathers and calculates various dashboard statistics by directly querying the database.
     *
     * @return array The array of statistics, or an empty array on failure.
     */
    public function getDashboardStats(): array
    {
        try {
            // Get today's date in 'YYYY-MM-DD' format based on Ghana timezone
            $today = (new DateTime('now', new DateTimeZone('Africa/Accra')))->format('Y-m-d');
            $yesterday = (new DateTime('yesterday', new DateTimeZone('Africa/Accra')))->format('Y-m-d');

            // --- Today's Bookings ---
            $stmt = $this->db->prepare("SELECT COUNT(id) AS total,
                                               SUM(CASE WHEN status IN ('booked', 'checked_in') THEN 1 ELSE 0 END) AS confirmed,
                                               SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
                                        FROM bookings
                                        WHERE check_in_date = :today");
            $this->executeQuery($stmt, [':today' => $today]);
            $bookingsData = $stmt->fetch(PDO::FETCH_ASSOC);

            $todayBookingsCount = (int)($bookingsData['total'] ?? 0);
            $confirmedBookings = (int)($bookingsData['confirmed'] ?? 0);
            $pendingBookings = (int)($bookingsData['pending'] ?? 0);

            // Fetch yesterday's bookings for change calculation
            $stmtYesterdayBookings = $this->db->prepare("SELECT COUNT(id) AS total FROM bookings WHERE check_in_date = :yesterday");
            $this->executeQuery($stmtYesterdayBookings, [':yesterday' => $yesterday]);
            $yesterdayBookingsCount = (int)($stmtYesterdayBookings->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

            $bookingsChange = $this->calculatePercentageChange($todayBookingsCount, $yesterdayBookingsCount);

            // --- Available Rooms ---
            // Assuming a 'rooms' table with 'status' like 'available', 'occupied', 'maintenance'
            // and a 'room_types' table if room counts depend on type
            $stmtTotalRooms = $this->db->prepare("SELECT COUNT(id) AS total_rooms FROM rooms");
            $this->executeQuery($stmtTotalRooms);
            $totalRooms = (int)($stmtTotalRooms->fetch(PDO::FETCH_ASSOC)['total_rooms'] ?? 0);

            // Get rooms currently not occupied and not under maintenance (or your definition of available)
            // This example assumes a simple 'available' status in the 'rooms' table
            $stmtAvailableRooms = $this->db->prepare("SELECT COUNT(r.id) AS available_rooms
                                                      FROM rooms r
                                                      LEFT JOIN bookings b ON r.id = b.room_id
                                                          AND :today BETWEEN b.check_in_date AND b.check_out_date
                                                          AND b.status IN ('booked', 'checked_in')
                                                      WHERE b.id IS NULL AND r.status = 'available'"); // Assuming 'available' status for rooms
            $this->executeQuery($stmtAvailableRooms, [':today' => $today]);
            $availableRooms = (int)($stmtAvailableRooms->fetch(PDO::FETCH_ASSOC)['available_rooms'] ?? 0);

            // For 'change' in available rooms, you'd need logic to compare with yesterday's availability.
            // This is complex as it depends on check-ins/outs yesterday. For now, a placeholder.
            $availableRoomsChange = '-5 from yesterday (placeholder)';

            // --- Today's Revenue ---
            // Sum of total_amount for bookings checking in or out today
            $stmtRevenue = $this->db->prepare("SELECT SUM(total_amount) AS booking_revenue
                                               FROM bookings
                                               WHERE check_in_date = :today_in OR check_out_date = :today_out");
            $this->executeQuery($stmtRevenue, [':today_in' => $today, ':today_out' => $today]);
            $bookingRevenue = (float)($stmtRevenue->fetch(PDO::FETCH_ASSOC)['booking_revenue'] ?? 0);

            // Sum of additional_charges from check_outs today
            $stmtAdditionalCharges = $this->db->prepare("SELECT SUM(additional_charges) AS extra_charges
                                                         FROM check_outs
                                                         WHERE DATE(checked_out_at) = :today");
            $this->executeQuery($stmtAdditionalCharges, [':today' => $today]);
            $additionalCharges = (float)($stmtAdditionalCharges->fetch(PDO::FETCH_ASSOC)['extra_charges'] ?? 0);

            $todayRevenue = $bookingRevenue + $additionalCharges;

            // Fetch yesterday's revenue for change calculation (similar logic)
            $stmtYesterdayRevenue = $this->db->prepare("SELECT SUM(total_amount) AS booking_revenue_yesterday
                                                        FROM bookings
                                                        WHERE check_in_date = :yesterday_in OR check_out_date = :yesterday_out");
            $this->executeQuery($stmtYesterdayRevenue, [':yesterday_in' => $yesterday, ':yesterday_out' => $yesterday]);
            $yesterdayBookingRevenue = (float)($stmtYesterdayRevenue->fetch(PDO::FETCH_ASSOC)['booking_revenue_yesterday'] ?? 0);

            $stmtYesterdayAddCharges = $this->db->prepare("SELECT SUM(additional_charges) AS extra_charges_yesterday
                                                           FROM check_outs
                                                           WHERE DATE(checked_out_at) = :yesterday");
            $this->executeQuery($stmtYesterdayAddCharges, [':yesterday' => $yesterday]);
            $yesterdayAdditionalCharges = (float)($stmtYesterdayAddCharges->fetch(PDO::FETCH_ASSOC)['extra_charges_yesterday'] ?? 0);

            $yesterdayRevenue = $yesterdayBookingRevenue + $yesterdayAdditionalCharges;
            $revenueChange = $this->calculatePercentageChange($todayRevenue, $yesterdayRevenue);

            $todayRevenueFormatted = '$' . number_format($todayRevenue, 2);
            $revenueTarget = '$15,000'; // Hardcoded example target

            // --- Today's Check-ins ---
            $stmtCheckIns = $this->db->prepare("SELECT COUNT(id) AS total_check_ins FROM check_ins WHERE DATE(checked_in_at) = :today");
            $this->executeQuery($stmtCheckIns, [':today' => $today]);
            $todayCheckInsCount = (int)($stmtCheckIns->fetch(PDO::FETCH_ASSOC)['total_check_ins'] ?? 0);

            // Fetch yesterday's check-ins for change calculation
            $stmtYesterdayCheckIns = $this->db->prepare("SELECT COUNT(id) AS total_check_ins FROM check_ins WHERE DATE(checked_in_at) = :yesterday");
            $this->executeQuery($stmtYesterdayCheckIns, [':yesterday' => $yesterday]);
            $yesterdayCheckInsCount = (int)($stmtYesterdayCheckIns->fetch(PDO::FETCH_ASSOC)['total_check_ins'] ?? 0);

            $checkInsChange = $this->calculatePercentageChange($todayCheckInsCount, $yesterdayCheckInsCount);


            return [
                [
                    "title" => "Today's Bookings",
                    "value" => (string)$todayBookingsCount,
                    "change" => $bookingsChange,
                    "description" => "{$confirmedBookings} confirmed, {$pendingBookings} pending"
                ],
                [
                    "title" => "Available Rooms",
                    "value" => (string)$availableRooms,
                    "change" => $availableRoomsChange,
                    "description" => "Out of {$totalRooms} total rooms"
                ],
                [
                    "title" => "Today's Revenue",
                    "value" => $todayRevenueFormatted,
                    "change" => $revenueChange,
                    "description" => "Target: {$revenueTarget}"
                ],
                [
                    "title" => "Today's Check-ins",
                    "value" => (string)$todayCheckInsCount,
                    "change" => $checkInsChange,
                    "description" => "Based on today's confirmed arrivals"
                ]
            ];
        } catch (Exception $e) {
            $this->lastError = "Failed to compile dashboard stats: " . $e->getMessage();
            error_log($this->lastError);
            return [];
        }
    }

    /**
     * Helper function to calculate percentage change.
     *
     * @param float $currentValue
     * @param float $previousValue
     * @return string
     */
    private function calculatePercentageChange(float $currentValue, float $previousValue): string
    {
        if ($previousValue == 0) {
            return $currentValue > 0 ? '+100%' : '0%'; // Or 'N/A' if previous was 0 and current is 0
        }
        $change = (($currentValue - $previousValue) / $previousValue) * 100;
        return ($change >= 0 ? '+' : '') . round($change) . '%';
    }
}
