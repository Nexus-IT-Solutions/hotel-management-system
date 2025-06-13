<?php

require_once __DIR__ . '/../model/Users.php';

/**
 * UserController Class
 * 
 * This controller handles user management operations including:
 * - Creating, reading, updating, and deleting users
 * - Handling unique constraint violations
 * - Validating user inputs
 * - Returning properly formatted responses
 */
class UserController
{
    /**
     * User model instance for database operations
     */
    protected Users $userModel;

    /**
     * Constructor - initializes the user model
     */
    public function __construct()
    {
        $this->userModel = new Users();
    }

    /**
     * Get all users 
     * 
     * @return string JSON response with users or error message
     */
    public function getProfile(): string
    {
        $users = $this->userModel->getAll();

        return json_encode([
            'status' => !empty($users) ? 'success' : 'error',
            'users' => $users,
            'message' => empty($users) ? 'No users found' : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get all branch users
     * 
     * @param string $branchId Branch ID
     * @return string JSON response with users or error message
     */
    public function getBranchUsers(string $branchId): string
    {
        $users = $this->userModel->getBranchUsers($branchId);

        return json_encode([
            'status' => !empty($users) ? 'success' : 'error',
            'branch_id' => $branchId,
            'branchUsers' => $users,
            'message' => empty($users) ? 'No users found for this branch' : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get user profile by ID
     * 
     * @param string $id User ID
     * @return string JSON response with user or error message
     */
    public function getUserById(string $id): string
    {
        $user = $this->userModel->getUserById($id);
        return json_encode([
            'status' => $user ? 'success' : 'error',
            'user' => $user,
            'message' => !$user ? "User not found with id {$id}" : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Find a user by their email address
     * 
     * @param string $email The user's email
     * @return string JSON response with user or error message
     */
    public function getUserByEmail(string $email): string
    {
        $user = $this->userModel->getUserByEmail($email);
        return json_encode([
            'status' => $user ? 'success' : 'error',
            'user' => $user,
            'message' => !$user ? 'User not found with this email' : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get user by phone
     * 
     * @param string $phone User phone number
     * @return string JSON response with user or error message
     */
    public function getUserByPhone(string $phone): string
    {
        $user = $this->userModel->getUserByPhone($phone);
        return json_encode([
            'status' => $user ? 'success' : 'error',
            'user' => $user,
            'message' => !$user ? 'User not found with this phone number' : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get user by username
     * 
     * @param string $username User username
     * @return string JSON response with user or error message
     */
    public function getUserByUsername(string $username): string
    {
        $user = $this->userModel->getUserByUsername($username);
        return json_encode([
            'status' => $user ? 'success' : 'error',
            'user' => $user,
            'message' => !$user ? 'User not found with this username' : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Find a user by their username, email or phone number
     * 
     * @param string $identifier The user's username, email, or phone number
     * @return string JSON response with user or error message
     */
    public function getUserByIdentifier(string $identifier): string
    {
        $user = $this->userModel->getUserByIdentifier($identifier);
        return json_encode([
            'status' => $user ? 'success' : 'error',
            'user' => $user,
            'message' => !$user ? 'User not found with this identifier' : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Check for unique constraint violations before creating or updating a user
     * 
     * @param array $data User data containing username, email, and phone
     * @param string|null $currentUserId Current user ID (for updates, to exclude the current user)
     * @return array|null Error info if violation found, null if no violations
     */
    private function checkUniqueConstraints(array $data, ?string $currentUserId = null): ?array
    {
        // Check username uniqueness
        if (!empty($data['username'])) {
            $existingUser = $this->userModel->getUserByUsername($data['username']);
            if ($existingUser && (!$currentUserId || $existingUser['id'] !== $currentUserId)) {
                return [
                    'field' => 'username',
                    'message' => 'Username already in use by another account'
                ];
            }
        }

        // Check email uniqueness
        if (!empty($data['email'])) {
            $existingUser = $this->userModel->getUserByEmail($data['email']);
            if ($existingUser && (!$currentUserId || $existingUser['id'] !== $currentUserId)) {
                return [
                    'field' => 'email',
                    'message' => 'Email already in use by another account'
                ];
            }
        }

        // Check phone uniqueness
        if (!empty($data['phone'])) {
            $existingUser = $this->userModel->getUserByPhone($data['phone']);
            if ($existingUser && (!$currentUserId || $existingUser['id'] !== $currentUserId)) {
                return [
                    'field' => 'phone',
                    'message' => 'Phone number already in use by another account'
                ];
            }
        }

        return null;
    }

    /**
     * Create a new User
     * 
     * @param array $data User data
     * @return string JSON response with created user or error message
     */
    public function createUser(array $data): string
    {
        // Check for required fields
        $requiredFields = ['username', 'email', 'phone', 'password', 'name', 'role'];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $missingFields[] = $field;
            }
        }

        if (!empty($missingFields)) {
            return json_encode([
                'status' => 'error',
                'message' => 'Missing required fields: ' . implode(', ', $missingFields)
            ], JSON_PRETTY_PRINT);
        }

        // Check for unique constraints
        $uniqueViolation = $this->checkUniqueConstraints($data);
        if ($uniqueViolation) {
            return json_encode([
                'status' => 'error',
                'field' => $uniqueViolation['field'],
                'message' => $uniqueViolation['message']
            ], JSON_PRETTY_PRINT);
        }

        // Try to create the user
        $user_id = $this->userModel->create($data);
        if ($user_id) {
            $user = $this->userModel->getUserById($user_id);
            return json_encode([
                'status' => 'success',
                'user' => $user,
                'message' => 'User created successfully'
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to create user: ' . $this->userModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Update a user's information
     * 
     * @param string $id The user's UUID
     * @param array $data Updated user data
     * @return string JSON response with updated user or error message
     */
    public function updateUser(string $id, array $data): string
    {
        // Check if user exists
        $existingUser = $this->userModel->getUserById($id);
        if (!$existingUser) {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }

        // Check for unique constraints
        $uniqueViolation = $this->checkUniqueConstraints($data, $id);
        if ($uniqueViolation) {
            return json_encode([
                'status' => 'error',
                'field' => $uniqueViolation['field'],
                'message' => $uniqueViolation['message']
            ], JSON_PRETTY_PRINT);
        }

        // Try to update the user
        $updated = $this->userModel->update($id, $data);
        if ($updated) {
            $user = $this->userModel->getUserById($id);
            return json_encode([
                'status' => 'success',
                'user' => $user,
                'message' => 'User updated successfully'
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to update user: ' . $this->userModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Delete a user from the database
     * 
     * @param string $id The user's UUID
     * @return string JSON response indicating success or failure
     */
    public function deleteUser(string $id): string
    {
        // Check if user exists
        $user = $this->userModel->getUserById($id);
        if (!$user) {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], JSON_PRETTY_PRINT);
        }

        // Actually perform the deletion (fixed the bug where it wasn't deleting)
        $deleted = $this->userModel->delete($id);

        if ($deleted) {
            return json_encode([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to delete user: ' . $this->userModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }
    }
}
