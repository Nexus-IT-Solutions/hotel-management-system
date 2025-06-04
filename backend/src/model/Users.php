<?php

namespace App\Model;

use PDO;
use PDOException;
use Ramsey\Uuid\Uuid;

class Users
{
    protected PDO $db;
    private $table_name = "users";

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getAll(): array
    {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table_name}
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find(string $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table_name}
            WHERE id = :id
        ");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table_name}
            WHERE email = :email
        ");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    public function findByPhone(string $phone): ?array
    {
        $stmt = $this->db->prepare("
            SELECT * FROM {$this->table_name}
            WHERE phone = :phone
        ");
        $stmt->execute(['phone' => $phone]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    public function create(array $data): string|false
    {
        $stmt = $this->db->prepare("
            INSERT INTO {$this->table_name} (id, hotel_id, name, email, phone, password_hash, role, is_active)
            VALUES (:id, :hotel_id, :name, :email, :phone, :password_hash, :role, :is_active)
        ");
        $uuid = $data['id'] ?? Uuid::uuid4()->toString();
        $stmt->execute([
            'id'            => $uuid,
            'hotel_id'      => $data['hotel_id'],
            'name'          => $data['name'],
            'email'         => $data['email'],
            'phone'         => $data['phone'],
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role'          => $data['role'],
            'is_active'     => $data['is_active'] ?? true,
        ]);
        return $uuid;
    }

    public function update(string $id, array $data): bool
    {
        $stmt = $this->db->prepare("
            UPDATE {$this->table_name} 
            SET hotel_id = :hotel_id, name = :name, email = :email, phone = :phone, role = :role, is_active = :is_active
            WHERE id = :id
        ");
        return $stmt->execute([
            'hotel_id'  => $data['hotel_id'],
            'name'      => $data['name'],
            'email'     => $data['email'],
            'phone'     => $data['phone'],
            'role'      => $data['role'],
            'is_active' => $data['is_active'],
            'id'        => $id,
        ]);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}