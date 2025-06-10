<?php
require_once __DIR__ . '/../model/Users.php';
require_once __DIR__ . '/../helper/JwtHelper.php';
require_once __DIR__ . '/../helper/SMSHelper.php';
require_once __DIR__ . '/../helper/MailHelper.php';

use Ramsey\Uuid\Uuid;

/**
 * AuthController Class
 * 
 * This controller handles user authentication processes including:
 * - Login functionality
 * - Password reset workflows (forgot/reset)
 * - Communication with users via email and SMS
 */
class AuthController
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
     * Authenticate a user by their username/email and password
     * 
     * @param string $usernameOrEmail The user's username or email
     * @param string $password The user's password
     * @return string JSON response with login result
     */
    public function login(string $usernameOrEmail, string $password): string
    {
        // Input validation
        if (empty($usernameOrEmail) || empty($password)) {
            return json_encode([
                'status' => 'error',
                'message' => 'Username/email and password are required',
                'code' => 400
            ]);
        }
        
        // Attempt login
        $user = $this->userModel->login($usernameOrEmail, $password);
        
        // Check if login failed
        if (!$user) {
            // Get the specific error from the model
            $errorMessage = $this->userModel->getLastError();
            $code = 401;
            
            if ($errorMessage === "User not found") {
                $code = 404;
            } else if ($errorMessage === "Account is inactive") {
                $code = 403;
            }
            
            return json_encode([
                'status' => 'error',
                'message' => $errorMessage ?: 'Invalid username or password',
                'code' => $code
            ]);
        }
        
        // Check if account is active
        if (!$user['is_active']) {
            return json_encode([
                'status' => 'error',
                'message' => 'Your account has been deactivated. Please contact support.',
                'code' => 403
            ]);
        }
        
        // Generate JWT token
        try {
            $payload = $user;
            // Use the existing user ID instead of generating a new UUID
            // This ensures consistent user identification in the token
            
            // Set token expiration from environment or use a default
            $expiry = isset($_ENV['JWT_EXPIRY']) ? intval($_ENV['JWT_EXPIRY']) : 3600;
            
            $jwt = JwtHelper::generate($payload, $expiry);
            
            // Return success response
            return json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'first_login' => (bool)$user['first_login']
                ],
                'token' => $jwt,
                'expires_in' => $expiry
            ]);
        } catch (Exception $e) {
            error_log("JWT generation error: " . $e->getMessage());
            return json_encode([
                'status' => 'error',
                'message' => 'Authentication error occurred',
                'code' => 500
            ]);
        }
    }

    /**
     * Initiates the password reset process for a user
     * 
     * @param string $emailOrPhone The user's email or phone number
     * @return bool True if reset process initiated, false if user not found
     */
    public function forgotPassword(string $emailOrPhone): ?string
    {
        $user = filter_var($emailOrPhone, FILTER_VALIDATE_EMAIL)
            ? $this->userModel->getUserByEmail($emailOrPhone)
            : $this->userModel->getUserByPhone($emailOrPhone);

        if (!$user) {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        $token = bin2hex(random_bytes(32));
        $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $this->userModel->setResetToken($user['email'], $token, $expiry);

        $success = false;
        if (filter_var($emailOrPhone, FILTER_VALIDATE_EMAIL)) {
            $success = MailHelper::sendPasswordResetEmail($user['email'], $user['name'], $token);
        } else {
            $success = SmsHelper::sendPasswordResetSMS($user['phone'], $token);
        }

        if ($success) {
            return json_encode([
                'status' => 'success',
                'message' => 'Password reset instructions have been sent'
            ], 200);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to send password reset instructions'
            ], 500);
        }
    }

    /**
     * Resets a user's password using a valid reset token
     * 
     * @param string $token The reset token
     * @param string $newPassword The new password to set
     * @return bool True if password reset successfully, false otherwise
     */
    public function resetPassword(string $token, string $newPassword): bool
    {
        $user = $this->userModel->findByResetToken($token);
        if (!$user) return false;

        return $this->userModel->updatePassword($user['id'], $newPassword);
    }
}
