<?php

namespace App\Helper;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper
{
    private static $secret = $_ENV['JWT_SECRET']; 

    public static function generate(array $payload, int $expirySeconds = $_ENV['JWT_EXPIRY']): string
    {
        $issuedAt = time();
        $payload['iat'] = $issuedAt;
        $payload['exp'] = $issuedAt + $expirySeconds;

        return JWT::encode($payload, self::$secret, $_ENV['JWT_ALGORITHM']);
    }

    public static function validate(string $token): ?array
    {
        try {
            return (array) JWT::decode($token, new Key(self::$secret, $_ENV['JWT_ALGORITHM']));
        } catch (\Exception $e) {
            return null;
        }
    }
}
