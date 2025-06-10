<?php
use Ramsey\Uuid\Uuid;
require_once __DIR__ . '/../config/Database.php';

/**
 * Users Model Class
 * 
 * This class handles all database operations related to user management in the hotel management system.
 * It provides methods for creating, retrieving, updating, and deleting user records,
 * as well as authentication and password management functionality.
 * 
 * Error handling is implemented throughout to properly catch and log database exceptions.
 */
class Users
{
    /**
     * Database connection instance
     */
    protected $db;
    
    /**
     * Name of the users database table
     */
    private $table_name = 'users';
    
    /**
     * Error message from the last operation
     */
    private $lastError = '';

    /**
     * Constructor - initializes the database connection
     */
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

    /**
     * Get the last error message
     * 
     * @return string The last error message
     */
    public function getLastError(): string
    {
        return $this->lastError;
    }

    /**
     * Execute a query with proper error handling
     * 
     * @param \PDOStatement $stmt The prepared statement to execute
     * @param array $params The parameters for the prepared statement
     * @return bool Whether the query executed successfully
     */
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
     * Get all users from the database
     * 
     * @return array List of all user records or empty array on failure
     */
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name}");
            if (!$this->executeQuery($stmt)) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to get users: " . $e->getMessage();
            error_log($this->lastError);
            return [];
        }
    }

    /**
     * Find a user by their ID
     * 
     * @param string $id The user's UUID
     * @return array|null User record or null if not found
     */
    public function getUserById(string $id): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE id = :id");
            if (!$this->executeQuery($stmt, ['id' => $id])) {
                return null;
            }
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get user by ID: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Find a user by their email address
     * 
     * @param string $email The user's email
     * @return array|null User record or null if not found
     */
    public function getUserByEmail(string $email): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE email = :email");
            if (!$this->executeQuery($stmt, ['email' => $email])) {
                return null;
            }
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get user by email: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Find a user by their phone number
     * 
     * @param string $phone The user's phone number
     * @return array|null User record or null if not found
     */
    public function getUserByPhone(string $phone): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE phone = :phone");
            if (!$this->executeQuery($stmt, ['phone' => $phone])) {
                return null;
            }
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get user by phone: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Find a user by their username
     * 
     * @param string $username The user's username
     * @return array|null User record or null if not found
     */
    public function getUserByUsername(string $username): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE username = :username");
            if (!$this->executeQuery($stmt, ['username' => $username])) {
                return null;
            }
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get user by username: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Find a user by their username, email or phone number
     * 
     * @param string $identifier The user's username, email, or phone number
     * @return array|null User record or null if not found
     */
    public function getUserByIdentifier(string $identifier): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login 
                                    FROM {$this->table_name} 
                                    WHERE username = :identifier 
                                       OR email = :identifier 
                                       OR phone = :identifier
                                    LIMIT 1");
            if (!$this->executeQuery($stmt, ['identifier' => $identifier])) {
                return null;
            }
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get user by identifier: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Find a user by their password reset token
     * Only returns the user if the token hasn't expired
     * 
     * @param string $token The reset token
     * @return array|null User record or null if not found or token expired
     */
    public function findByResetToken(string $token): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE reset_token = :token AND reset_token_expiry > NOW()");
            if (!$this->executeQuery($stmt, ['token' => $token])) {
                return null;
            }
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get user by reset token: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Authenticate a user by username/email and password
     * Updates the last login timestamp upon successful login
     * 
     * @param string $usernameOrEmail The username or email for login
     * @param string $password The user's password
     * @return array|null User record on successful login or null on failure
     */
    public function login(string $usernameOrEmail, string $password): ?array
    {
        try {
            // Check for empty inputs
            if (empty($usernameOrEmail) || empty($password)) {
                $this->lastError = "Username/email and password are required";
                return null;
            }
            
            // Find user by username OR email
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE username = :identifier OR email = :identifier");
            if (!$this->executeQuery($stmt, ['identifier' => $usernameOrEmail])) {
                $this->lastError = "Database error during login";
                return null;
            }
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Check if user exists
            if (!$user) {
                $this->lastError = "User not found";
                return null;
            }
            
            // Check if user account is active
            if (!$user['is_active']) {
                $this->lastError = "Account is inactive";
                return null;
            }
            
            // Verify password
            if (!password_verify($password, $user['password_hash'])) {
                $this->lastError = "Invalid password";
                
                // Optional: Track failed login attempts here
                // $this->recordFailedLoginAttempt($user['id']);
                
                return null;
            }
            
            // Password is valid, check if needs rehash (if PHP's password_hash defaults have changed)
            if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
                // Update password hash with new algorithm/cost
                $this->updatePasswordHash($user['id'], $password);
            }
            
            // Remove sensitive data before returning
            unset($user['password_hash']);
            unset($user['reset_token']);
            unset($user['reset_token_expiry']);
            
            // Update last login timestamp
            $this->updateLastLogin($user['id']);
            
            return $user;
        } catch (PDOException $e) {
            $this->lastError = "Login failed: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    /**
     * Updates the password hash if the hashing algorithm parameters have changed
     * 
     * @param string $userId The user's ID
     * @param string $password The plain text password to rehash
     * @return bool Whether the operation was successful
     */
    private function updatePasswordHash(string $userId, string $password): bool
    {
        try {
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $this->db->prepare("UPDATE {$this->table_name} SET password_hash = :hash WHERE id = :id");
            return $this->executeQuery($stmt, [
                'hash' => $newHash,
                'id' => $userId
            ]);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update password hash: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Records a failed login attempt (optional security feature)
     * 
     * @param string $userId The user's ID
     * @return bool Whether the operation was successful
     */
    private function recordFailedLoginAttempt(string $userId): bool
    {
        try {
            // Update failed login attempts counter and timestamp
            $stmt = $this->db->prepare("UPDATE {$this->table_name} SET 
                                 failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
                                 last_failed_login = CURRENT_TIMESTAMP
                                 WHERE id = :id");
            return $this->executeQuery($stmt, ['id' => $userId]);
        } catch (PDOException $e) {
            $this->lastError = "Failed to record login attempt: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Create a new user in the database
     * 
     * @param array $data User data including hotel_id, branch_id, username, name, email, 
     *                    phone, password, role, and is_active status
     * @return string|false The UUID of the created user or false on failure
     */
    public function create(array $data): string|false
    {
        try {
            // Validate required fields
            $requiredFields = ['username', 'name', 'phone', 'password', 'role'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    $this->lastError = "Missing required field: $field";
                    return false;
                }
            }
            
            // Check if user already exists
            if ($this->getUserByEmail($data['email']) || $this->getUserByUsername($data['username']) || $this->getUserByPhone($data['phone'])) {
                $this->lastError = "User already exists with this email, username, or phone";
                return false;
            }
            
            $uuid = $data['id'] ?? Uuid::uuid4()->toString();
            
            $stmt = $this->db->prepare("INSERT INTO {$this->table_name} (id, hotel_id, branch_id, username, name, email, phone, password_hash, role, is_active, first_login) 
                                     VALUES (:id, :hotel_id, :branch_id, :username, :name, :email, :phone, :password_hash, :role, :is_active, :first_login)");
            
            $params = [
                'id'            => $uuid,
                'hotel_id'      => $data['hotel_id'] ?? null,
                'branch_id'     => $data['branch_id'] ?? null,
                'username'      => $data['username'],
                'name'          => $data['name'],
                'email'         => $data['email'],
                'phone'         => $data['phone'],
                'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
                'role'          => $data['role'],
                'is_active'     => $data['is_active'] ?? true,
                'first_login'   => true,
            ];
            
            if (!$this->executeQuery($stmt, $params)) {
                return false;
            }
            
            return $uuid;
        } catch (PDOException $e) {
            $this->lastError = "Failed to create user: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Update a user's information
     * 
     * @param string $id The user's UUID
     * @param array $data Updated user data
     * @return bool True on success, false on failure
     */
    public function update(string $id, array $data): bool
    {
        try {
            // Check if user exists
            if (!$this->getUserById($id)) {
                $this->lastError = "User not found";
                return false;
            }

            // Allowed fields to be updated
            $allowedFields = [
                'hotel_id',
                'branch_id',
                'username',
                'name',
                'email',
                'phone',
                'role',
                'is_active'
            ];

            $fields = [];
            $params = [':id' => $id];

            foreach ($data as $key => $value) {
                if (in_array($key, $allowedFields)) {
                    $fields[] = "$key = :$key";
                    $params[":$key"] = $value;
                }
            }

            if (empty($fields)) {
                $this->lastError = "No valid fields provided for update.";
                return false;
            }

            $sql = "UPDATE {$this->table_name} SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->db->prepare($sql);

            return $this->executeQuery($stmt, $params);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update user: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }


    /**
     * Update a user's last login timestamp and mark as not first login
     * 
     * @param string $id The user's UUID
     * @return bool True on success, false on failure
     */
    public function updateLastLogin(string $id): bool
    {
        try {
            $stmt = $this->db->prepare("UPDATE {$this->table_name} SET last_login = CURRENT_TIMESTAMP, first_login = false WHERE id = :id");
            return $this->executeQuery($stmt, ['id' => $id]);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update last login: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Update user's password after confirming the current password
     * Also clears any password reset tokens
     * 
     * @param string $id The user's UUID
     * @param string $currentPassword The current password for verification
     * @param string $newPassword The new password to set
     * @return bool True if password updated, false if current password is incorrect
     */
    public function updatePasswordWithConfirmation(string $id, string $currentPassword, string $newPassword): bool
    {
        try {
            // Validate password requirements
            if (strlen($newPassword) < 8) {
                $this->lastError = "Password must be at least 8 characters";
                return false;
            }
            
            $stmt = $this->db->prepare("SELECT password_hash FROM {$this->table_name} WHERE id = :id");
            if (!$this->executeQuery($stmt, ['id' => $id])) {
                return false;
            }
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$user) {
                $this->lastError = "User not found";
                return false;
            }
            
            if (!password_verify($currentPassword, $user['password_hash'])) {
                $this->lastError = "Current password is incorrect";
                return false;
            }
            
            $stmt = $this->db->prepare("UPDATE {$this->table_name} SET 
                                     password_hash = :password_hash, 
                                     reset_token = NULL, 
                                     reset_token_expiry = NULL, 
                                     first_login = false 
                                     WHERE id = :id");
            
            return $this->executeQuery($stmt, [
                'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT),
                'id' => $id
            ]);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update password: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Update user's password without requiring the current password
     * Used for admin resets and password reset flows
     * Also clears any password reset tokens
     * 
     * @param string $id The user's UUID
     * @param string $newPassword The new password to set
     * @return bool True on success, false on failure
     */
    public function updatePassword(string $id, string $newPassword): bool
    {
        try {
            // Validate password requirements
            if (strlen($newPassword) < 8) {
                $this->lastError = "Password must be at least 8 characters";
                return false;
            }
            
            $stmt = $this->db->prepare("UPDATE {$this->table_name} SET 
                                     password_hash = :password_hash, 
                                     reset_token = NULL, 
                                     reset_token_expiry = NULL, 
                                     first_login = false 
                                     WHERE id = :id");
            
            return $this->executeQuery($stmt, [
                'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT),
                'id' => $id
            ]);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update password: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Set a password reset token for a user
     * 
     * @param string $email The user's email
     * @param string $token The reset token
     * @param string $expiry The expiration timestamp
     * @return bool True on success, false on failure
     */
    public function setResetToken(string $email, string $token, string $expiry): bool
    {
        try {
            // Check if user exists
            if (!$this->getUserByEmail($email)) {
                $this->lastError = "User not found";
                return false;
            }
            
            $stmt = $this->db->prepare("UPDATE {$this->table_name} SET 
                                     reset_token = :token, 
                                     reset_token_expiry = :expiry 
                                     WHERE email = :email");
            
            return $this->executeQuery($stmt, [
                'token'  => $token,
                'expiry' => $expiry,
                'email'  => $email,
            ]);
        } catch (PDOException $e) {
            $this->lastError = "Failed to set reset token: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    /**
     * Delete a user from the database
     * 
     * @param string $id The user's UUID
     * @return bool True on success, false on failure
     */
    public function delete(string $id): bool
    {
        try {
            // Check if user exists
            if (!$this->getUserById($id)) {
                $this->lastError = "User not found";
                return false;
            }
            
            $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = :id");
            return $this->executeQuery($stmt, ['id' => $id]);
        } catch (PDOException $e) {
            $this->lastError = "Failed to delete user: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }
}