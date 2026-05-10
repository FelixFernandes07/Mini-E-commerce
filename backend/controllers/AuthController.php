<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

class AuthController {
    private User $user;

    public function __construct() {
        $db = new Database();
        $this->user = new User($db->getConnection());
    }

    public function register(): void {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            Response::error('Preenche todos os campos!');
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Email inválido!');
        }

        if (strlen($data['password']) < 6) {
            Response::error('A senha deve ter pelo menos 6 caracteres!');
        }

        if ($this->user->findByEmail($data['email'])) {
            Response::error('Email já registado!');
        }

        $role = $data['role'] ?? 'client';
        if ($role !== 'client' && $role !== 'admin') {
            $role = 'client';
        }

        if ($this->user->create($data['name'], $data['email'], $data['password'], $role)) {
            Response::success(null, 'Conta criada com sucesso!', 201);
        } else {
            Response::error('Erro ao criar conta!', 500);
        }
    }

    public function login(): void {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email']) || empty($data['password'])) {
            Response::error('Preenche todos os campos!');
        }

        $user = $this->user->findByEmail($data['email']);

        if (!$user || !password_verify($data['password'], $user['password'])) {
            Response::error('Email ou senha incorrectos!', 401);
        }

        $token = JWT::generate([
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'exp' => time() + 86400
        ]);

        Response::success([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ], 'Login efectuado com sucesso!');
    }

    public function resetPassword(): void {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email'])) {
            Response::error('Email obrigatório!');
        }

        $user = $this->user->findByEmail($data['email']);

        if (!$user) {
            Response::error('Email não encontrado!', 404);
        }

        $token = bin2hex(random_bytes(32));

        Response::success(['token' => $token], 'Email de recuperação enviado!');
    }
}