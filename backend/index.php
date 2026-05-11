<?php
require_once __DIR__ . '/config/cors.php';

$uri = strtolower($_SERVER['REQUEST_URI']);

if (str_contains($uri, '/auth/')) {
    require_once __DIR__ . '/routes/auth.php';
} elseif (str_contains($uri, '/products')) {
    require_once __DIR__ . '/routes/products.php';
} elseif (str_contains($uri, '/orders')) {
    require_once __DIR__ . '/routes/orders.php';
} elseif (str_contains($uri, '/users')) {
    require_once __DIR__ . '/routes/users.php';
} elseif (str_contains($uri, '/categories')) {
    require_once __DIR__ . '/routes/categories.php';
} else {
    http_response_code(200);
    echo json_encode(['message' => 'API funcionando!', 'uri' => $uri]);
}