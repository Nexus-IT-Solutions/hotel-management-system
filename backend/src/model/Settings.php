<?php
require_once __DIR__ . '/../config/Database.php';

use Ramsey\Uuid\Uuid;

/**
 * Setting Model Class
 * Handles all database operations related to the `settings` table.
 */
class Setting
{
    protected $db;
    private $table_name = 'settings';
    private $lastError = '';

    public function __construct()
    {
        try {
            $database = new Database();
            $this->db = $database->getConnection();
        } catch (PDOException $e) {
            $this->lastError = "Database connection failed: " . $e->getMessage();
            error_log($this->lastError);
            throw $e;
        }
    }

    public function getLastError(): string
    {
        return $this->lastError;
    }

    protected function executeQuery(\PDOStatement $stmt, array $params = []): bool
    {
        try {
            return $stmt->execute($params);
        } catch (PDOException $e) {
            $this->lastError = "Query execution failed: " . $e->getMessage();
            error_log($this->lastError . " - SQL: " . $stmt->queryString);
            return false;
        }
    }

    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name}");
            if (!$this->executeQuery($stmt)) {
                return [];
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = "Failed to get settings: " . $e->getMessage();
            error_log($this->lastError);
            return [];
        }
    }

    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table_name} WHERE id = ?");
            if (!$this->executeQuery($stmt, [$id])) {
                return null;
            }
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            $this->lastError = "Failed to get setting: " . $e->getMessage();
            error_log($this->lastError);
            return null;
        }
    }

    public function create(array $data): bool
    {
        $requiredFields = ['key', 'value'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) { // Use isset for potentially empty but existing values
                $this->lastError = "Missing required field: $field";
                return false;
            }
        }

        $id = Uuid::uuid4()->toString();

        // Assuming created_at and updated_at are handled by default in the DB or added later if needed.
        // For consistency, if your other tables have them, you might consider adding them to the settings table too.
        // For now, sticking strictly to the provided schema.

        $stmt = $this->db->prepare("INSERT INTO {$this->table_name}
            (id, hotel_id, branch_id, `key`, `value`, description)
            VALUES (:id, :hotel_id, :branch_id, :key, :value, :description)");

        $params = [
            ':id' => $id,
            ':hotel_id' => $data['hotel_id'] ?? null,
            ':branch_id' => $data['branch_id'] ?? null,
            ':key' => $data['key'],
            ':value' => $data['value'],
            ':description' => $data['description'] ?? null,
        ];

        return $this->executeQuery($stmt, $params);
    }

    public function update(string $id, array $data): bool
    {
        if (empty($data)) {
            $this->lastError = "No data provided for update.";
            return false;
        }

        $fields = [];
        $params = [':id' => $id];

        foreach ($data as $key => $value) {
            if (in_array($key, ['hotel_id', 'branch_id', 'key', 'value', 'description'])) {
                $fields[] = "`$key` = :$key"; // Backticks for 'key' are important
                $params[":$key"] = $value;
            }
        }

        if (empty($fields)) {
            $this->lastError = "No valid fields provided for update.";
            return false;
        }

        $sql = "UPDATE {$this->table_name} SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $this->executeQuery($stmt, $params);
        } catch (PDOException $e) {
            $this->lastError = "Failed to update setting: " . $e->getMessage();
            error_log($this->lastError);
            return false;
        }
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $this->executeQuery($stmt, [$id]);
    }
}
