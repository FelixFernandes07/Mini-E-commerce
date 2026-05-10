<?php
class Upload {
    private string $uploadDir;

    public function __construct() {
        $this->uploadDir = __DIR__ . '/../uploads/';
    }

    public function handleImage(array $file): string|false {
        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        
        if (!in_array($file['type'], $allowed)) {
            return false;
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            return false;
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $ext;
        $destination = $this->uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return 'uploads/' . $filename;
        }

        return false;
    }
}