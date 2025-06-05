<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;
use Phinx\Util\Literal;
final class AddAuditlogs extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function change(): void
    {
        $this->table('audit_logs', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', [
                'default' => Literal::from('uuid_generate_v4()'),
                'null' => false
            ])
            ->addColumn('user_id', 'uuid', ['null' => true])
            ->addColumn('action', 'string') // e.g., 'created', 'updated', 'deleted'
            ->addColumn('entity_type', 'string') // e.g., 'booking', 'room'
            ->addColumn('entity_id', 'uuid')
            ->addColumn('description', 'text', ['null' => true])
            ->addColumn('metadata', 'jsonb', ['null' => true]) // optional extra info
            ->addColumn('performed_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('user_id', 'users', 'id', ['delete' => 'SET NULL'])
            ->create();
    }
}