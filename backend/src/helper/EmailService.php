<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService
{
    private $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true); // Enable exceptions
        try {
            // Server settings
            $this->mail->isSMTP();
            $this->mail->Host       = $_ENV['MAIL_HOST'];   
            $this->mail->SMTPAuth   = true;
            $this->mail->Username   = $_ENV['MAIL_USERNAME'];   
            $this->mail->Password   = $_ENV['MAIL_PASSWORD'];                  
            $this->mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
            $this->mail->Port       = $_ENV['MAIL_PORT'];
            // Recipients
            $this->mail->setFrom('no-reply@yourdomain.com', 'Hotel Management System');
            $this->mail->isHTML(true);
        } catch (Exception $e) {
            error_log("PHPMailer initialization error: {$e->getMessage()}");
            throw new Exception("Failed to initialize email service: " . $e->getMessage());
            echo "Mailer Error: {$this->mail->ErrorInfo}";
            return false;

        }
    }

    /**
     * Sends an OTP to a specified email address.
     *
     * @param string $toEmail The recipient's email address.
     * @param string $otpCode The 6-digit OTP to send.
     * @return bool True on success, false on failure.
     */
    public function sendOtpEmail(string $toEmail, string $otpCode): bool
    {
        try {
            $this->mail->addAddress($toEmail);     // Add a recipient

            $this->mail->Subject = 'Your One-Time Password (OTP) for Password Reset';
            $this->mail->Body    = "
                <p>Dear User,</p>
                <p>Your One-Time Password (OTP) for password reset is: <strong>{$otpCode}</strong></p>
                <p>This OTP is valid for a limited time. Do not share this code with anyone.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thank you,</p>
                <p>The Hotel Management System Team</p>
            ";
            $this->mail->AltBody = "Your One-Time Password (OTP) for password reset is: {$otpCode}. This OTP is valid for a limited time. Do not share this code with anyone. If you did not request a password reset, please ignore this email.";

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Failed to send OTP email to {$toEmail}: {$this->mail->ErrorInfo}");
            echo "Mailer Error: {$this->mail->ErrorInfo}";
            return false;
        }
    }
}
