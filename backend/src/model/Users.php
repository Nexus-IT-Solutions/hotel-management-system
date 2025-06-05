<?php

use Ramsey\Uuid\Uuid;

require_once __DIR__ . '/../config/Database.php';
/**
 * Users Model Class
 * 
 * This class handles all database operations related to user management in the hotel management system.
 * It provides methods for creating, retrieving, updating, and deleting user records,
 * as well as authentication and password management functionality.
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

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    /**
     * Get all users from the database
     * 
     * @return array List of all user records
     */
    public function getAll(): array
    {
        $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name}");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Find a user by their ID
     * 
     * @param string $id The user's UUID
     * @return array|null User record or null if not found
     */
    public function getUserById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    /**
     * Find a user by their email address
     * 
     * @param string $email The user's email
     * @return array|null User record or null if not found
     */
    public function getUserByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    /**
     * Find a user by their phone number
     * 
     * @param string $phone The user's phone number
     * @return array|null User record or null if not found
     */
    public function getUserByPhone(string $phone): ?array
    {
        $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE phone = :phone");
        $stmt->execute(['phone' => $phone]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    /**
     * Find a user by their username
     * 
     * @param string $username The user's username
     * @return array|null User record or null if not found
     */
    public function getUserByUsername(string $username): ?array
    {
        $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
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
        $stmt = $this->db->prepare("SELECT id, hotel_id, branch_id, username, name, email, phone, role, is_active, first_login, last_login FROM {$this->table_name} WHERE reset_token = :token AND reset_token_expiry > NOW()");
        $stmt->execute(['token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
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
        $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE username = :username OR email = :email");
        $stmt->execute(['username' => $usernameOrEmail, 'email' => $usernameOrEmail]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($password, $user['password_hash'])) {
            unset($user['password_hash']);
            $this->updateLastLogin($user['id']);
            return $user;
        }
        return null;
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
        $stmt = $this->db->prepare("INSERT INTO users (id, hotel_id, branch_id, username, name, email, phone, password_hash, role, is_active, first_login) VALUES (:id, :hotel_id, :branch_id, :username, :name, :email, :phone, :password_hash, :role, :is_active, :first_login)");
        $uuid = $data['id'] ?? Uuid::uuid4()->toString();
        $stmt->execute([
            'id'            => $uuid,
            'hotel_id'      => $data['hotel_id'],
            'branch_id'     => $data['branch_id'],
            'username'      => $data['username'],
            'name'          => $data['name'],
            'email'         => $data['email'],
            'phone'         => $data['phone'],
            'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            'role'          => $data['role'],
            'is_active'     => $data['is_active'] ?? true,
            'first_login'   => true,
        ]);
        return $uuid;
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
        $stmt = $this->db->prepare("UPDATE users SET hotel_id = :hotel_id, branch_id = :branch_id, username = :username, name = :name, email = :email, phone = :phone, role = :role, is_active = :is_active WHERE id = :id");
        return $stmt->execute([
            'hotel_id'  => $data['hotel_id'],
            'branch_id' => $data['branch_id'],
            'username'  => $data['username'],
            'name'      => $data['name'],
            'email'     => $data['email'],
            'phone'     => $data['phone'],
            'role'      => $data['role'],
            'is_active' => $data['is_active'],
            'id'        => $id,
        ]);
    }

    /**
     * Update a user's last login timestamp and mark as not first login
     * 
     * @param string $id The user's UUID
     * @return bool True on success, false on failure
     */
    public function updateLastLogin(string $id): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP, first_login = false WHERE id = :id");
        return $stmt->execute(['id' => $id]);
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
        $stmt = $this->db->prepare("SELECT password_hash FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
            return false;
        }
        $stmt = $this->db->prepare("UPDATE users SET password_hash = :password_hash, reset_token = NULL, reset_token_expiry = NULL, first_login = false WHERE id = :id");
        return $stmt->execute([
            'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT),
            'id' => $id
        ]);
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
        $stmt = $this->db->prepare("UPDATE users SET password_hash = :password_hash, reset_token = NULL, reset_token_expiry = NULL, first_login = false WHERE id = :id");
        return $stmt->execute([
            'password_hash' => password_hash($newPassword, PASSWORD_BCRYPT),
            'id' => $id
        ]);
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
        $stmt = $this->db->prepare("UPDATE users SET reset_token = :token, reset_token_expiry = :expiry WHERE email = :email");
        return $stmt->execute([
            'token'  => $token,
            'expiry' => $expiry,
            'email'  => $email,
        ]);
    }

    /**
     * Delete a user from the database
     * 
     * @param string $id The user's UUID
     * @return bool True on success, false on failure
     */
    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}