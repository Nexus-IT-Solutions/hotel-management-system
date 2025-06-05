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
     * @return array|null User data on successful login or null on failure
     */
    public function login(string $usernameOrEmail, string $password): ?string
    {
        $user = $this->userModel->login($usernameOrEmail, $password);

        if ($user && $user['is_active']) {
            $payload = $user;
            $payload['id'] = Uuid::uuid4()->toString(); // Generate a unique ID for the JWT

            $jwt = JwtHelper::generate($payload, $_ENV['JWT_EXPIRY']);

            return json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $jwt,
                'expires_in' => $_ENV['JWT_EXPIRY']
            ], 200);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Invalid username or password'
            ], 401);
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
            ? $this->userModel->findByEmail($emailOrPhone)
            : $this->userModel->findByPhone($emailOrPhone);

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
