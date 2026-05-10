<?php
require_once __DIR__ . '/config/cors.php';

$path = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
$path = strtolower($path);

if (str_contains($path, 'auth')) {
    require_once __DIR__ . '/routes/auth.php';
} elseif (str_contains($path, 'products')) {
    require_once __DIR__ . '/routes/products.php';
} elseif (str_contains($path, 'orders')) {
    require_once __DIR__ . '/routes/orders.php';
} elseif (str_contains($path, 'users')) {
    require_once __DIR__ . '/routes/users.php';
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Rota não encontrada!']);
}