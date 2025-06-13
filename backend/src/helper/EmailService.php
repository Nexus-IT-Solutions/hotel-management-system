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
            $this->mail->isSMTP();                                            // Send using SMTP
            $this->mail->Host       = $_ENV['SMTP_HOST'];                     // Set the SMTP server to send through
            $this->mail->SMTPAuth   = true;                                   // Enable SMTP authentication
            $this->mail->Username   = $_ENV['SMTP_USERNAME'];               // SMTP username
            $this->mail->Password   = $_ENV['SMTP_PASSWORD'];                  // SMTP password
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also accepted
            $this->mail->Port       = $_ENV['SMTP_PORT'];                                    // TCP port to connect to

            // Recipients
            $this->mail->setFrom('no-reply@yourdomain.com', 'Hotel Management System');
            $this->mail->isHTML(true);                                        // Set email format to HTML
        } catch (Exception $e) {
            error_log("PHPMailer initialization error: {$e->getMessage()}");
            // You might want to throw an exception or handle this more gracefully
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
            return false;
        }
    }
}
