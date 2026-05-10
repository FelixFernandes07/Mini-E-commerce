<?php
require_once __DIR__ . '/../controllers/ProductController.php';

$controller = new ProductController();
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = explode('/', trim($path, '/'));
$id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) 
    ? (int)$parts[count($parts) - 1] 
    : null;

if ($method === 'GET' && !$id) {
    $controller->index();
} elseif ($method === 'GET' && $id) {
    $controller->show($id);
} elseif ($method === 'POST') {
    $controller->create();
} elseif ($method === 'PUT' && $id) {
    $controller->update($id);
} elseif ($method === 'DELETE' && $id) {
    $controller->delete($id);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Rota não encontrada!']);
}