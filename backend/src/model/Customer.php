<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * Customer Model Class
 * 
 * Handles all database operations related to the `customers` table.
 */
class Customer
{
    protected $db;
    private $table_name = 'customers';
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

       /**
     * Finds an existing customer or creates a new one if not found.
     * Updates existing customer's phone/email if name matches.
     *
     * @param string $fullName Customer's full name.
     * @param string $email Customer's email address.
     * @param string $phone Customer's phone number.
     * @param array $data Optional array for other customer fields (address, nationality, etc.)
     * @return string|null The customer ID on success, or null on failure.
     */
    public function findOrCreateCustomer(array $data): ?string
    {
        // Try to find an existing customer by email
        $stmt = $this->db->prepare("SELECT id FROM {$this->table_name} WHERE email = :email LIMIT 1");
        $this->executeQuery($stmt, [':email' => $data['email_address']]);
        $customer = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($customer) {
            // Found existing customer by email, return their ID
            return $customer['id'];
        }

        // If not found by email, try by phone
        $stmt = $this->db->prepare("SELECT id FROM {$this->table_name} WHERE phone = :phone LIMIT 1");
        $this->executeQuery($stmt, [':phone' => $data['phone_number']]);
        $customer = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($customer) {
            // Found existing customer by phone, return their ID
            return $customer['id'];
        }

        // If no existing customer found, create a new one
        $id = Uuid::uuid4()->toString();
        $stmt = $this->db->prepare("INSERT INTO {$this->table_name}
            (id, full_name, email, phone, address, nationality, id_type, id_number)
            VALUES (:id, :full_name, :email, :phone, :address, :nationality, :id_type, :id_number)");

        $params = [
            ':id' => $id,
            ':full_name' => $data['customer_name'],
            ':email' => $data['email_address'], 
            ':phone' => $data['phone'],
            ':address' => $data['address'] ?? null,
            ':nationality' => $data['nationality'] ?? null,
            ':id_type' => $data['id_type'] ?? null,
            ':id_number' => $data['id_number'] ?? null,
        ];

        if ($this->executeQuery($stmt, $params)) {
            return $id;
        } else {
            return null;
        }
    }

    
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name}");
            if (!$this->executeQuery($stmt)) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to get customers: " . $e->getMessage();
            error_log($this->lastError);
            return [];
        }
    }

    public function getCustomersSummary(): array
    {
        try {
            // SQL query to join customer, emergency contact, and booking data
            // It groups by customer to count bookings and concatenate emergency contacts
            $query = "
                SELECT
                    c.id AS id,
                    c.full_name AS name,
                    c.email AS email,
                    c.phone AS phone,
                    c.address AS address,
                    -- Use GROUP_CONCAT to get emergency contact phone(s).
                    -- DISTINCT ensures unique numbers if a customer has multiple emergency contacts.
                    -- ORDER BY ensures consistent ordering if there are multiple.
                    -- COALESCE handles cases where a customer has no emergency contact.
                    COALESCE(GROUP_CONCAT(DISTINCT ec.phone ORDER BY ec.created_at DESC), 'N/A') AS emergencyContact,
                    COUNT(b.id) AS totalBookings
                FROM
                    " . $this->table_name . " c
                LEFT JOIN
                    emergency_contacts ec ON c.id = ec.customer_id
                LEFT JOIN
                    bookings b ON c.id = b.customer_id
                GROUP BY
                    c.id, c.full_name, c.email, c.phone, c.address
                ORDER BY
                    c.full_name ASC; -- Order alphabetically by customer name
            ";

            $stmt = $this->db->prepare($query);

            if (!$this->executeQuery($stmt)) {
                // executeQuery already logs the error and sets $this->lastError
                return [];
            }

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to retrieve customer summary: " . $e->getMessage();
            error_log($this->lastError); // Log the detailed error
            return [];
        }
    }

    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE id = ?");
            if (!$this->executeQuery($stmt, [$id])) {
                return null;
            }
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get customer: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    public function create(array $data): bool
    {
        $requiredFields = ['full_name', 'email', 'phone', 'nationality', 'purpose_of_visit', 'id_type', 'id_number'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();

        $stmt = $this->db->prepare("INSERT INTO {$this->table_name} 
            (id, full_name, email, phone, address, nationality, purpose_of_visit, id_type, id_number) 
            VALUES (:id, :full_name, :email, :phone, :address, :nationality, :purpose_of_visit, :id_type, :id_number)");

        $params = [
            ':id' => $id,
            ':full_name' => $data['full_name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':address' => $data['address'] ?? null,
            ':nationality' => $data['nationality'],
            ':purpose_of_visit' => $data['purpose_of_visit'],
            ':id_type' => $data['id_type'],
            ':id_number' => $data['id_number'],
        ];

        return $this->executeQuery($stmt, $params);
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
            if (in_array($key, ['full_name', 'email', 'phone', 'address', 'nationality', 'purpose_of_visit', 'id_type', 'id_number'])) {
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
            $this->lastError = "Failed to update customer: " . $e->getMessage();
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
