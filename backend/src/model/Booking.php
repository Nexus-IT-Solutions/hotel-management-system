<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * Booking Model Class
 * * Handles all database operations related to the `bookings` table.
 */
class Booking
{
    protected $db;
    private $table_name = 'bookings';
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

    protected function executeQuery(\PDOStatement $stmt, array $params = []): bool
    {
        try {
            return $stmt->execute($params);
        } catch (PDOException $e) {
            $this->lastError = "Query execution failed: " . $e->getMessage();
            error_log($this->lastError . " - SQL: " . $stmt->queryString);
            return false;
        }
    }

    public function getAllBookingSummary(): array
    {
        try {
            // Construct the SQL query with LEFT JOINs and aliases
            $query = "
                SELECT
                    b.id AS id,
                    c.full_name AS customer,
                    c.phone AS phone,
                    r.room_number AS room,
                    rt.name AS roomType,
                    b.check_in_date AS checkIn,
                    b.check_out_date AS checkOut,
                    b.number_of_guests AS guests,
                    b.status AS status,
                    b.total_amount AS total
                FROM
                    " . $this->table_name . " b
                LEFT JOIN
                    customers c ON b.customer_id = c.id
                LEFT JOIN
                    rooms r ON b.room_id = r.id
                LEFT JOIN
                    room_types rt ON b.room_type_id = rt.id
                ORDER BY
                    b.created_at DESC; -- Or b.check_in_date DESC, depending on desired order
            ";

            $stmt = $this->db->prepare($query);

            if (!$this->executeQuery($stmt)) {
                // executeQuery already logs the error and sets $this->lastError
                return [];
            }

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to retrieve all bookings: " . $e->getMessage();
            error_log($this->lastError); // Log the detailed error
            return [];
        }
    }

    /**
     * Retrieves a booking by its ID, including customer and emergency contact details.
     *
     * @param string $id The unique identifier of the booking.
     * @return array|null Returns an associative array of booking details if found, or null if not found.
     */
    public function getById(string $id): ?array
    {
        try {
            $query = "
                SELECT 
                    b.*,
                    c.id as customer_id, 
                    c.full_name as customer_name, 
                    c.phone as customer_phone, 
                    c.email as customer_email,
                    c.address as customer_address,
                    c.nationality as customer_nationality,
                    c.id_type as customer_id_type,
                    c.id_number as customer_id_number,
                    ec.id as emergency_contact_id,
                    ec.name as emergency_contact_name,
                    ec.relationship as emergency_contact_relationship,
                    ec.phone as emergency_contact_phone,
                    rt.name as room_type_name,
                    h.name as hotel_name,
                    br.name as branch_name
                FROM {$this->table_name} b
                LEFT JOIN customers c ON b.customer_id = c.id
                LEFT JOIN (
                    SELECT ec1.*
                    FROM emergency_contacts ec1
                    INNER JOIN (
                        SELECT customer_id, MAX(id) AS max_id
                        FROM emergency_contacts
                        GROUP BY customer_id
                    ) ec2 ON ec1.customer_id = ec2.customer_id AND ec1.id = ec2.max_id
                ) ec ON c.id = ec.customer_id
                LEFT JOIN room_types rt ON b.room_type_id = rt.id
                LEFT JOIN hotels h ON b.hotel_id = h.id
                LEFT JOIN branches br ON b.branch_id = br.id
                WHERE b.id = ?
            ";
            
            $stmt = $this->db->prepare($query);
            if (!$this->executeQuery($stmt, [$id])) {
                return null;
            }
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$result) {
                return null;
            }
            
            // Restructure the result to include booking, customer and emergency contact info
            $booking = [
                'id' => $result['id'],
                'booking_code' => $result['booking_code'],
                'room_id' => $result['room_id'],
                'room_type_id' => $result['room_type_id'],
                'room_type_name' => $result['room_type_name'],
                'hotel_id' => $result['hotel_id'],
                'hotel_name' => $result['hotel_name'],
                'branch_id' => $result['branch_id'],
                'branch_name' => $result['branch_name'],
                'check_in_date' => $result['check_in_date'],
                'check_out_date' => $result['check_out_date'],
                'status' => $result['status'],
                'special_requests' => $result['special_requests'],
                'number_of_guests' => $result['number_of_guests'],
                'total_amount' => $result['total_amount'],
                'purpose_of_visit' => $result['purpose_of_visit'] ?? null,
                'payment_method' => $result['payment_method'] ?? null,
                'created_at' => $result['created_at'] ?? null,
                'updated_at' => $result['updated_at'] ?? null,
                'customer' => [
                    'id' => $result['customer_id'],
                    'full_name' => $result['customer_name'],
                    'phone' => $result['customer_phone'],
                    'email' => $result['customer_email'],
                    'address' => $result['customer_address'],
                    'nationality' => $result['customer_nationality'],
                    'id_type' => $result['customer_id_type'],
                    'id_number' => $result['customer_id_number']
                ],
                'emergency_contact' => null
            ];
            
            // Add emergency contact if available
            if (!empty($result['emergency_contact_id'])) {
                $booking['emergency_contact'] = [
                    'id' => $result['emergency_contact_id'],
                    'name' => $result['emergency_contact_name'],
                    'relationship' => $result['emergency_contact_relationship'],
                    'phone' => $result['emergency_contact_phone']
                ];
            }
            
            return $booking;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get booking: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Get booking by booking code
     * @param booking_code
     */
    public function getByBookingCode(string $booking_code): ?array
    {
        try {
            $query = "SELECT * FROM {$this->table_name} WHERE booking_code = ?";
            $stmt = $this->db->prepare($query);
            if (!$this->executeQuery($stmt, [$booking_code])) {
                return null;
            }
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? $result : null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get booking by code: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

   /**
     * Creates a new booking, including customer and emergency contact information.
     *
     * @param array $data An associative array containing booking, customer, and emergency contact details.
     * Expected keys:
     * - 'customerName', 'phone', 'email' (for customer)
     * - 'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone' (optional)
     * - 'hotelId', 'branchId', 'checkIn', 'checkOut', 'roomType', 'availableRoom', 'guests', 'specialRequests'
     * - 'total_amount' (this needs to be part of $data, even if calculated elsewhere)
     * @return bool True if the booking and associated data are successfully created, false otherwise.
     */
    public function create(array $data): bool|array
    {
        if (empty($data)) {
            $this->lastError = "No data provided for booking creation.";
            return false;
        }
        // 1. Validate incoming data based on the updated request body
        $requiredCustomerFields = [
            'customer_name',
            'phone_number',
            'address',
            'nationality',
            'id_type',
            'id_number'
        ];

        $requiredBookingFields = [
            'hotel_id',
            'branch_id',
            'check_in_date',
            'check_out_date',
            'room_type_id', // Maps to roomType
            'room_id', // Maps to availableRoom
            'number_of_guests', // Maps to guests
            'total_amount',
            'purpose_of_visit',
        ];

        // Validate customer fields
        foreach ($requiredCustomerFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required customer field: $field";
                return false;
            }
        }

        // Validate booking fields
        foreach ($requiredBookingFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required booking field: $field";
                return false;
            }
        }

        require_once __DIR__ . '/Customer.php';
        // 2. Create or retrieve customer
        $customerModel = new Customer();
        $customer_id = $customerModel->findOrCreateCustomer($data );

        if (!$customer_id) {
            $this->lastError = "Failed to create or retrieve customer: " . $customerModel->getLastError();
            return false;
        }
        // 3. Handle Emergency Contact (if provided)
        $emergencyData = [
            'name' => $data['emergency_contact_name'] ?? null,
            'relationship' => $data['emergency_contact_relationship'] ?? null,
            'phone' => $data['emergency_contact_phone'] ?? null
        ];

        if (!empty($emergencyData)) {
            require_once __DIR__ . '/EmergencyContact.php';
            $emergencyContactModel = new EmergencyContact();
            $emergencyContactData = [
                'customer_id' => $customer_id,
                'name' => $emergencyData['name'],
                'relationship' => $emergencyData['relationship'],
                'phone' => $emergencyData['phone']
            ];
            if (!$emergencyContactModel->create($emergencyContactData)) {
                $this->lastError = "Failed to create emergency contact: " . $emergencyContactModel->getLastError();
                return false;
            }
        }

        // 4. Generate UUID for the booking
        $booking_id = Uuid::uuid4()->toString();

        // 5. Generate a simple booking code (consider a more robust, unique generation for production)
        $booking_code = 'BK-' . strtoupper(substr(Uuid::uuid4()->toString(), 0, 8));

        // 6. Prepare and execute the booking insertion
        $stmt = $this->db->prepare("INSERT INTO {$this->table_name}
            (id, booking_code, customer_id, room_id, room_type_id, hotel_id, branch_id, check_in_date, check_out_date, status, special_requests, number_of_guests, total_amount, purpose_of_visit, payment_method)
            VALUES (:id, :booking_code, :customer_id, :room_id, :room_type_id, :hotel_id, :branch_id, :check_in_date, :check_out_date, :status, :special_requests, :number_of_guests, :total_amount, :purpose_of_visit, :payment_method)");

        $params = [
            ':id' => $booking_id,
            ':booking_code' => $booking_code,
            ':customer_id' => $customer_id,
            ':room_id' => $data['room_id'], // Maps from availableRoom
            ':room_type_id' => $data['room_type_id'], // Maps from roomType
            ':hotel_id' => $data['hotel_id'],
            ':branch_id' => $data['branch_id'],
            ':check_in_date' => $data['check_in_date'],
            ':check_out_date' => $data['check_out_date'],
            ':status' => $data['status'] ?? 'pending', // Default to 'pending' if not provided
            ':special_requests' => $data['special_requests'] ?? null,
            ':number_of_guests' => $data['number_of_guests'], // Use consistent field name
            ':total_amount' => $data['total_amount'], // Ensure this is provided in $data
            ':purpose_of_visit' => $data['purpose_of_visit'], // Add purpose of visit parameter
            ':payment_method' => $data['payment_method'] ?? null // Add payment method with null default
        ];

        if($this->executeQuery($stmt, $params)){
            return $this->getById($booking_id);
        }
        return false;
    }

    public function update(string $id, array $data): bool
    {
        if (empty($data)) {
            $this->lastError = "No data provided for update.";
            return false;
        }

        $fields = [];
        $params = [':id' => $id];

        foreach ($data as $key => $value) {
            if (in_array($key, [
                'customer_id',
                'room_id',
                'room_type_id',
                'hotel_id',
                'branch_id',
                'check_in_date',
                'check_out_date',
                'status',
                'special_requests',
                'number_of_guests',
                'total_amount'
            ])) {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }

        $fields[] = "updated_at = CURRENT_TIMESTAMP";

        $sql = "UPDATE {$this->table_name} SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $this->executeQuery($stmt, $params);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update booking: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $this->executeQuery($stmt, [$id]);
    }
}
