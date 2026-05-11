<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

$method = $_SERVER['REQUEST_METHOD'];

$db = new Database();
$product = new Product($db->getConnection());

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $result = $product->getById((int)$_GET['id']);
        if (!$result) Response::error('Produto não encontrado!', 404);
        Response::success($result);
    } else {
        Response::success($product->getAll());
    }
} elseif ($method === 'POST') {
    $user = JWT::getFromHeader();
    if (!$user || $user['role'] !== 'admin') Response::error('Acesso negado!', 403);

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

    if ($product->create($name, $description, (float)$price, (int)$stock, (int)$category_id, $image)) {
        Response::success(null, 'Produto criado com sucesso!', 201);
    } else {
        Response::error('Erro ao criar produto!', 500);
    }
} elseif ($method === 'PUT') {
    $user = JWT::getFromHeader();
    if (!$user || $user['role'] !== 'admin') Response::error('Acesso negado!', 403);

    $data = json_decode(file_get_contents('php://input'), true);
    $id = (int)$_GET['id'];

    if ($product->update($id, $data['name'], $data['description'] ?? '', $data['price'], $data['stock'] ?? 0, $data['category_id'])) {
        Response::success(null, 'Produto actualizado!');
    } else {
        Response::error('Erro ao actualizar produto!', 500);
    }
} elseif ($method === 'DELETE') {
    $user = JWT::getFromHeader();
    if (!$user || $user['role'] !== 'admin') Response::error('Acesso negado!', 403);

    $id = (int)$_GET['id'];
    if ($product->delete($id)) {
        Response::success(null, 'Produto apagado!');
    } else {
        Response::error('Erro ao apagar produto!', 500);
    }
} else {
    Response::error('Método não permitido!', 405);
}