<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'mini_ecommerce';
    private $username = 'root';
    private $password = '';
    private PDO|null $conn = null;

    public function getConnection(): PDO {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Erro de conexão: ' . $e->getMessage()]);
            exit();
        }
        return $this->conn;
    }
}