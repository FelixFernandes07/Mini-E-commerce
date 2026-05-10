<?php
require_once __DIR__ . '/../controllers/AuthController.php';

$controller = new AuthController();
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'POST' && str_ends_with($path, '/auth/register')) {
    $controller->register();
} elseif ($method === 'POST' && str_ends_with($path, '/auth/login')) {
    $controller->login();
} elseif ($method === 'POST' && str_ends_with($path, '/auth/reset-password')) {
    $controller->resetPassword();
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Rota não encontrada!']);
}