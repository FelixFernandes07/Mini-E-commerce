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

        require_once __DIR__ . '/../utils/upload.php';
        $upload = new Upload();

        $image = '';
        if (!empty($_FILES['image'])) {
            $image = $upload->handleImage($_FILES['image']);
            if (!$image) Response::error('Imagem inválida!');
        }

        $name = $_POST['name'] ?? '';
        $description = $_POST['description'] ?? '';
        $price = $_POST['price'] ?? 0;
        $stock = $_POST['stock'] ?? 0;
        $category_id = $_POST['category_id'] ?? 0;

        if (empty($name) || empty($price) || empty($category_id)) {
            Response::error('Preenche todos os campos obrigatórios!');
        }

        if ($this->product->create($name, $description, (float)$price, (int)$stock, (int)$category_id, $image)) {
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

        require_once __DIR__ . '/../utils/upload.php';
        $upload = new Upload();

        $image = $_POST['image'] ?? '';
        if (!empty($_FILES['image'])) {
            $newImage = $upload->handleImage($_FILES['image']);
            if ($newImage) $image = $newImage;
        }

        $name = $_POST['name'] ?? '';
        $description = $_POST['description'] ?? '';
        $price = $_POST['price'] ?? 0;
        $stock = $_POST['stock'] ?? 0;
        $category_id = $_POST['category_id'] ?? 0;

        if ($this->product->updateWithImage($id, $name, $description, (float)$price, (int)$stock, (int)$category_id, $image)) {
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