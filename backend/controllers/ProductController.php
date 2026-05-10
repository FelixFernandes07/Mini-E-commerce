<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

class ProductController {
    private Product $product;

    public function __construct() {
        $db = new Database();
        $this->product = new Product($db->getConnection());
    }

    public function index(): void {
        $products = $this->product->getAll();
        Response::success($products);
    }

    public function show(int $id): void {
        $product = $this->product->getById($id);
        if (!$product) {
            Response::error('Produto não encontrado!', 404);
        }
        Response::success($product);
    }

    public function create(): void {
        $user = JWT::getFromHeader();
        if (!$user || $user['role'] !== 'admin') {
            Response::error('Acesso negado!', 403);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['price']) || empty($data['category_id'])) {
            Response::error('Preenche todos os campos obrigatórios!');
        }

        if ($this->product->create(
            $data['name'],
            $data['description'] ?? '',
            $data['price'],
            $data['stock'] ?? 0,
            $data['category_id'],
            $data['image'] ?? ''
        )) {
            Response::success(null, 'Produto criado com sucesso!', 201);
        } else {
            Response::error('Erro ao criar produto!', 500);
        }
    }

    public function update(int $id): void {
        $user = JWT::getFromHeader();
        if (!$user || $user['role'] !== 'admin') {
            Response::error('Acesso negado!', 403);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if ($this->product->update(
            $id,
            $data['name'],
            $data['description'] ?? '',
            $data['price'],
            $data['stock'] ?? 0,
            $data['category_id']
        )) {
            Response::success(null, 'Produto actualizado com sucesso!');
        } else {
            Response::error('Erro ao actualizar produto!', 500);
        }
    }

    public function delete(int $id): void {
        $user = JWT::getFromHeader();
        if (!$user || $user['role'] !== 'admin') {
            Response::error('Acesso negado!', 403);
        }

        if ($this->product->delete($id)) {
            Response::success(null, 'Produto apagado com sucesso!');
        } else {
            Response::error('Erro ao apagar produto!', 500);
        }
    }
}