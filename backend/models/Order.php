<?php
class Order {
    private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function getAll(): array {
        $stmt = $this->conn->prepare("
            SELECT o.*, u.name as user_name, u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getByUser(int $user_id): array {
        $stmt = $this->conn->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll();
    }

    public function getById(int $id): array|false {
        $stmt = $this->conn->prepare("
            SELECT o.*, u.name as user_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        ");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getItems(int $order_id): array {
        $stmt = $this->conn->prepare("
            SELECT oi.*, p.name as product_name
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ");
        $stmt->execute([$order_id]);
        return $stmt->fetchAll();
    }

    public function create(int $user_id, float $total): int {
        $stmt = $this->conn->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
        $stmt->execute([$user_id, $total]);
        return (int)$this->conn->lastInsertId();
    }

    public function addItem(int $order_id, int $product_id, int $quantity, float $price): bool {
        $stmt = $this->conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        return $stmt->execute([$order_id, $product_id, $quantity, $price]);
    }

    public function updateStatus(int $id, string $status): bool {
        $stmt = $this->conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $id]);
    }
}