<?php
class User {
    private PDO $conn;
    private string $table = 'users';

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function findByEmail(string $email): array|false {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function findById(int $id): array|false {
        $stmt = $this->conn->prepare("SELECT id, name, email, role, created_at FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create(string $name, string $email, string $password, string $role = 'client'): bool {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (name, email, password, role) VALUES (?, ?, ?, ?)");
        return $stmt->execute([$name, $email, $hash, $role]);
    }

    public function getAll(): array {
        $stmt = $this->conn->prepare("SELECT id, name, email, role, created_at FROM {$this->table}");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function updateRole(int $id, string $role): bool {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET role = ? WHERE id = ?");
        return $stmt->execute([$role, $id]);
    }

    public function delete(int $id): bool {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }
}