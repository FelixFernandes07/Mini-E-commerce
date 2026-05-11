<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = JWT::getFromHeader();

if (!$user) {
    Response::error('Não autenticado!', 401);
}

$db = new Database();
$order = new Order($db->getConnection());

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $result = $order->getById((int)$_GET['id']);
        if (!$result) Response::error('Pedido não encontrado!', 404);
        $result['items'] = $order->getItems((int)$_GET['id']);
        Response::success($result);
    } elseif ($user['role'] === 'admin') {
        Response::success($order->getAll());
    } else {
        Response::success($order->getByUser($user['id']));
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['items']) || empty($data['total'])) {
        Response::error('Dados incompletos!');
    }

    $order_id = $order->create($user['id'], $data['total']);

    foreach ($data['items'] as $item) {
        $order->addItem($order_id, $item['product_id'], $item['quantity'], $item['price']);
    }

    Response::success(['order_id' => $order_id], 'Pedido criado com sucesso!', 201);
} elseif ($method === 'PUT') {
    if ($user['role'] !== 'admin') Response::error('Acesso negado!', 403);

    $data = json_decode(file_get_contents('php://input'), true);
    $id = (int)$_GET['id'];

    if ($order->updateStatus($id, $data['status'])) {
        Response::success(null, 'Estado actualizado!');
    } else {
        Response::error('Erro ao actualizar!', 500);
    }
} else {
    Response::error('Método não permitido!', 405);
}