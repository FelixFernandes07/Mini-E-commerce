<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

$db = new Database();
$conn = $db->getConnection();
$user = new User($conn);

if ($method === 'POST') {
    if ($action === 'register') {
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

    } elseif ($action === 'reset') {
        if (empty($data['email'])) {
            Response::error('Email obrigatório!');
        }
        $found = $user->findByEmail($data['email']);
        if (!$found) {
            Response::error('Email não encontrado!', 404);
        }

        $code = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
        $expires = date('Y-m-d H:i:s', time() + 900);

        $stmt = $conn->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?");
        $stmt->execute([$data['email'], $code, $expires, $code, $expires]);

        Response::success(['code' => $code], 'Código gerado com sucesso!');

    } elseif ($action === 'verify-code') {
        if (empty($data['email']) || empty($data['code'])) {
            Response::error('Email e código obrigatórios!');
        }
        $stmt = $conn->prepare("SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()");
        $stmt->execute([$data['email'], $data['code']]);
        $reset = $stmt->fetch();

        if (!$reset) {
            Response::error('Código inválido ou expirado!');
        }
        Response::success(null, 'Código válido!');

    } elseif ($action === 'new-password') {
        if (empty($data['email']) || empty($data['code']) || empty($data['password'])) {
            Response::error('Dados incompletos!');
        }
        $stmt = $conn->prepare("SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()");
        $stmt->execute([$data['email'], $data['code']]);
        $reset = $stmt->fetch();

        if (!$reset) {
            Response::error('Código inválido ou expirado!');
        }
        $hash = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stmt->execute([$hash, $data['email']]);

        $stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
        $stmt->execute([$data['email']]);

        Response::success(null, 'Senha alterada com sucesso!');

    } else {
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