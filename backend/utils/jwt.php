<?php
class JWT {
    private static $secret = 'minishop_secret_key_2026';

    public static function generate(array $payload): string {
        $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = base64_encode(json_encode($payload));
        $signature = base64_encode(hash_hmac('sha256', "$header.$payload", self::$secret, true));
        return "$header.$payload.$signature";
    }

    public static function verify(string $token): array|false {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;

        [$header, $payload, $signature] = $parts;
        $validSig = base64_encode(hash_hmac('sha256', "$header.$payload", self::$secret, true));

        if (!hash_equals($validSig, $signature)) return false;

        return json_decode(base64_decode($payload), true);
    }

    public static function getFromHeader(): array|false {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? '';
        if (!str_starts_with($auth, 'Bearer ')) return false;
        $token = substr($auth, 7);
        return self::verify($token);
    }
}