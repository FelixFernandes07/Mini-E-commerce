<?php
class Response {
    public static function success($data = null, string $message = 'Sucesso', int $code = 200): void {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
        exit();
    }

    public static function error(string $message = 'Erro', int $code = 400): void {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit();
    }
}