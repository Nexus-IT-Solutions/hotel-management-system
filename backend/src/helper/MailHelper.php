<?php

require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


class MailHelper
{
    public static function sendPasswordResetEmail($to, $name, $token)
    {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.example.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'your@email.com';
            $mail->Password   = 'yourpassword';
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;

            $mail->setFrom('no-reply@yourdomain.com', 'Your Hotel System');
            $mail->addAddress($to, $name);

            $resetUrl = "https://yourdomain.com/reset-password?token=$token";

            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Request';
            $mail->Body    = "Hi $name,<br><br>Click the link below to reset your password:<br><a href='$resetUrl'>$resetUrl</a><br><br>If you didn't request this, please ignore.";

            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
