<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

class OrderController {
    private Order $order;

    public function __construct() {
        $db = new Database();
        $this->order = new Order($db->getConnection());
    }

    public function index(): void {
        $user = JWT::getFromHeader();
        if (!$user) Response::error('Não autenticado!', 401);

        if ($user['role'] === 'admin') {
            $orders = $this->order->getAll();
        } else {
            $orders = $this->order->getByUser($user['id']);
        }

        Response::success($orders);
    }

    public function show(int $id): void {
        $user = JWT::getFromHeader();
        if (!$user) Response::error('Não autenticado!', 401);

        $order = $this->order->getById($id);
        if (!$order) Response::error('Pedido não encontrado!', 404);

        $items = $this->order->getItems($id);
        $order['items'] = $items;

        Response::success($order);
    }

    public function create(): void {
        $user = JWT::getFromHeader();
        if (!$user) Response::error('Não autenticado!', 401);

        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['items']) || empty($data['total'])) {
            Response::error('Dados incompletos!');
        }

        $order_id = $this->order->create($user['id'], $data['total']);

        foreach ($data['items'] as $item) {
            $this->order->addItem($order_id, $item['product_id'], $item['quantity'], $item['price']);
        }

        Response::success(['order_id' => $order_id], 'Pedido criado com sucesso!', 201);
    }

    public function updateStatus(int $id): void {
        $user = JWT::getFromHeader();
        if (!$user || $user['role'] !== 'admin') {
            Response::error('Acesso negado!', 403);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if ($this->order->updateStatus($id, $data['status'])) {
            Response::success(null, 'Estado actualizado com sucesso!');
        } else {
            Response::error('Erro ao actualizar estado!', 500);
        }
    }
}