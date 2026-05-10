<?php
class Product {
    private PDO $conn;
    private string $table = 'products';

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function getAll(): array {
        $stmt = $this->conn->prepare("
            SELECT p.*, c.name as category_name 
            FROM {$this->table} p
            LEFT JOIN categories c ON p.category_id = c.id
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getById(int $id): array|false {
        $stmt = $this->conn->prepare("
            SELECT p.*, c.name as category_name 
            FROM {$this->table} p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create(string $name, string $description, float $price, int $stock, int $category_id, string $image = ''): bool {
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (name, description, price, stock, category_id, image) VALUES (?, ?, ?, ?, ?, ?)");
        return $stmt->execute([$name, $description, $price, $stock, $category_id, $image]);
    }

    public function update(int $id, string $name, string $description, float $price, int $stock, int $category_id): bool {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET name=?, description=?, price=?, stock=?, category_id=? WHERE id=?");
        return $stmt->execute([$name, $description, $price, $stock, $category_id, $id]);
    }

    public function delete(int $id): bool {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }
}