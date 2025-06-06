<?php

require_once __DIR__ . '/../model/Users.php';

class UserController
{
    /**
     * User model instance for database operations
     */
    protected Users $userModel;

    /**
     * Constructor - initializes the user model
     * 
     * @param Users $userModel The Users model instance
     */
    public function __construct()
    {
        $this->userModel = new Users();
    }

    /**
     * Get all user profile 
     * 
     * @return array|null User data or null if not found
     */
    public function getProfile(): ?string
    {
        $users = $this->userModel->getAll();

        if ($users) {
            return json_encode([
                'status' => 'success',
                'users' => $users
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Get user profile by ID
     * 
     * @param string $id User ID
     * @return string|null User data or null if not found
     */
    public function getUserById(string $id): ?string
    {
        $user = $this->userModel->getUserById($id);
        if ($user) {
            return json_encode([
                'status' => 'success',
                'user' => $user
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Find a user by their email address
     * 
     * @param string $email The user's email
     * @return array|null User record or null if not found
     */
    public function getUserByEmail(string $email): ?string
    {
        $user = $this->userModel->getUserByEmail($email);
        if ($user) {
            return json_encode([
                'status' => 'success',
                'user' => $user
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Get user by phone
     * 
     * @param string $phone User phone number
     * @return string|null User data or null if not found
     */
    public function getUserByPhone(string $phone): ?string
    {
        $user = $this->userModel->getUserByPhone($phone);
        if ($user) {
            return json_encode([
                'status' => 'success',
                'user' => $user
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Get user by username
     * 
     * @param string $username User username
     * @return string|null User data or null if not found
     */
    public function getUserByUsername(string $username): ?string
    {
        $user = $this->userModel->getUserByUsername($username);
        if ($user) {
            return json_encode([
                'status' => 'success',
                'user' => $user
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Find a user by their username, email or phone number
     * 
     * @param string $identifier The user's username, email, or phone number
     * @return array|null User record or null if not found
     */
    public function getUserByIdentifier(string $identifier): ?string
    {
        $user = $this->userModel->getUserByIdentifier($identifier);
        if ($user) {
            return json_encode([
                'status' => 'success',
                'user' => $user
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }

    }

    /**
     * Create a new User
     * 
     *  @param array $data 
     *  @return string|false User data or false or failure 
     */
    public function createUser(array $data): string|false
    {
        $user_id = $this->userModel->create($data);
        if ($user_id) {
            $user = $this->userModel->getUserById($user_id);
            return json_encode([
                'status' => 'success',
                'user' => $user
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to create user'
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Update a user's information
     * 
     * @param string $id The user's UUID
     * @param array $data Updated user data
     * @return bool True on success, false on failure
     */
    public function updateUser(string $id, array $data): string|false
    {
        $updated = $this->userModel->update($id, $data);
        if ($updated) {
            $user = $this->userModel->getUserById($id);
            return json_encode([
                'status' => 'success',
                'user' => $user
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to update user'
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Delete a user from the database
     * 
     * @param string $id The user's UUID
     * @return bool True on success, false on failure
     */
    public function deleteUser(string $id): bool
    {
        $user = $this->userModel->getUserById($id);
        if ($user) {
           return json_encode([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }
    }
}