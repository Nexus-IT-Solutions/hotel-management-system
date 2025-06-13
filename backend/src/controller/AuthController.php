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
                'user' => $user,
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
     * Initiates the password reset process for a user using OTP
     * 
     * @param string $emailOrPhone The user's email or phone number
     * @return string JSON response
     */
    public function forgotPassword(string $emailOrPhone): ?string
    {
        // Find user by email or phone
        $user = filter_var($emailOrPhone, FILTER_VALIDATE_EMAIL)
            ? $this->userModel->getUserByEmail($emailOrPhone)
            : $this->userModel->getUserByPhone($emailOrPhone);

        if (!$user) {
            return json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Generate OTP and expiry
        $otp = $this->userModel->generateOtp();
        $expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        // Store OTP in the database
        $setOtp = $this->userModel->setOtpCode($user['email'], $otp, $expiry);

        if (!$setOtp) {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to generate OTP. Please try again.'
            ], 500);
        }

        // Send OTP via email or SMS
        $success = false;
        if (filter_var($emailOrPhone, FILTER_VALIDATE_EMAIL)) {
            // $success = MailHelper::sendPasswordResetEmail($user['email'], $user['name'], $otp);
        } else {
            // $success = SmsHelper::sendPasswordResetSMS($user['phone'], $otp);
        }

        if ($success) {
            return json_encode([
                'status' => 'success',
                'message' => 'Password reset OTP has been sent'
            ], 200);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to send OTP'
            ], 500);
        }
    }

    /**
     * Resets a user's password using a valid OTP
     * 
     * @param string $otp The OTP code
     * @param string $newPassword The new password to set
     * @return string JSON response
     */
    public function resetPassword(string $otp, string $newPassword): string
    {
        $user = $this->userModel->findByOtpCode($otp);
        if (!$user) {
            return json_encode([
                'status' => 'error',
                'message' => 'Invalid or expired OTP'
            ], 400);
        }

        $updated = $this->userModel->updatePassword($user['id'], $newPassword);
        if ($updated) {
            return json_encode([
                'status' => 'success',
                'message' => 'Password has been reset successfully'
            ]);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to reset password'
            ], 500);
        }
    }
}
