<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$uri = strtolower($_SERVER['REQUEST_URI']);

$db = new Database();
$user = new User($db->getConnection());

if ($method === 'POST') {
    if (str_contains($uri, 'register')) {
        // REGISTO
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            Response::error('Preenche todos os campos!');
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Email inválido!');
        }

        if ($user->findByEmail($data['email'])) {
            Response::error('Email já registado!');
        }

        $role = $data['role'] ?? 'client';

        if ($user->create($data['name'], $data['email'], $data['password'], $role)) {
            Response::success(null, 'Conta criada com sucesso!', 201);
        } else {
            Response::error('Erro ao criar conta!', 500);
        }

    } elseif (str_contains($uri, 'reset')) {
        // RESET PASSWORD
        if (empty($data['email'])) {
            Response::error('Email obrigatório!');
        }

        $found = $user->findByEmail($data['email']);
        if (!$found) {
            Response::error('Email não encontrado!', 404);
        }

        Response::success(null, 'Email de recuperação enviado!');

    } else {
        // LOGIN
        if (empty($data['email']) || empty($data['password'])) {
            Response::error('Preenche todos os campos!');
        }

        $found = $user->findByEmail($data['email']);

        if (!$found || !password_verify($data['password'], $found['password'])) {
            Response::error('Email ou senha incorrectos!', 401);
        }

        $token = JWT::generate([
            'id' => $found['id'],
            'email' => $found['email'],
            'role' => $found['role'],
            'exp' => time() + 86400
        ]);

        Response::success([
            'token' => $token,
            'user' => [
                'id' => $found['id'],
                'name' => $found['name'],
                'email' => $found['email'],
                'role' => $found['role']
            ]
        ], 'Login efectuado com sucesso!');
    }
} else {
    Response::error('Método não permitido!', 405);
}