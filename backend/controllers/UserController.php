<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/jwt.php';
require_once __DIR__ . '/../utils/response.php';

class UserController {
    private User $user;

    public function __construct() {
        $db = new Database();
        $this->user = new User($db->getConnection());
    }

    public function index(): void {
        $user = JWT::getFromHeader();
        if (!$user || $user['role'] !== 'admin') {
            Response::error('Acesso negado!', 403);
        }

        $users = $this->user->getAll();
        Response::success($users);
    }

    public function create(): void {
        $auth = JWT::getFromHeader();
        if (!$auth || $auth['role'] !== 'admin') {
            Response::error('Acesso negado!', 403);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            Response::error('Preenche todos os campos!');
        }

        if ($this->user->findByEmail($data['email'])) {
            Response::error('Email já registado!');
        }

        $role = $data['role'] ?? 'client';

        if ($this->user->create($data['name'], $data['email'], $data['password'], $role)) {
            Response::success(null, 'Utilizador criado com sucesso!', 201);
        } else {
            Response::error('Erro ao criar utilizador!', 500);
        }
    }

    public function updateRole(int $id): void {
        $user = JWT::getFromHeader();
        if (!$user || $user['role'] !== 'admin') {
            Response::error('Acesso negado!', 403);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if ($this->user->updateRole($id, $data['role'])) {
            Response::success(null, 'Role actualizado com sucesso!');
        } else {
            Response::error('Erro ao actualizar role!', 500);
        }
    }

    public function delete(int $id): void {
        $user = JWT::getFromHeader();
        if (!$user || $user['role'] !== 'admin') {
            Response::error('Acesso negado!', 403);
        }

        if ($this->user->delete($id)) {
            Response::success(null, 'Utilizador apagado com sucesso!');
        } else {
            Response::error('Erro ao apagar utilizador!', 500);
        }
    }
}