<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class InitHotelSchema extends AbstractMigration
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
        // Enable UUID extension
        $this->execute(sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // Hotel
        $this->table('hotels', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('name', 'string')
            ->addColumn('address', 'text')
            ->addColumn('city', 'string')
            ->addColumn('country', 'string')
            ->addColumn('phone', 'string')
            ->addColumn('email', 'string')
            ->addColumn('description', 'text', ['null' => true])
            ->addTimestamps()
            ->create();

        // RoomType
        $this->table('room_types', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('hotel_id', 'uuid')
            ->addColumn('name', 'string')
            ->addColumn('description', 'text')
            ->addColumn('price_per_night', 'decimal', ['precision' => 10, 'scale' => 2])
            ->addColumn('max_occupancy', 'integer')
            ->addColumn('amenities', 'jsonb', ['null' => true])
            ->addTimestamps()
            ->addForeignKey('hotel_id', 'hotels', 'id', ['delete' => 'CASCADE'])
            ->create();

        // Room
        $this->table('rooms', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('hotel_id', 'uuid')
            ->addColumn('room_type_id', 'uuid')
            ->addColumn('room_number', 'string')
            ->addColumn('floor', 'integer')
            ->addColumn('status', 'enum', ['values' => ['available', 'occupied', 'maintenance', 'dirty']])
            ->addTimestamps()
            ->addForeignKey('hotel_id', 'hotels', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('room_type_id', 'room_types', 'id', ['delete' => 'SET NULL'])
            ->create();

        // Customer
        $this->table('customers', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('full_name', 'string')
            ->addColumn('email', 'string')
            ->addColumn('phone', 'string')
            ->addColumn('address', 'text')
            ->addColumn('id_type', 'string')
            ->addColumn('id_number', 'string')
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->create();

        // EmergencyContact
        $this->table('emergency_contacts', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('customer_id', 'uuid')
            ->addColumn('name', 'string')
            ->addColumn('relationship', 'string')
            ->addColumn('phone', 'string')
            ->addColumn('email', 'string', ['null' => true])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('customer_id', 'customers', 'id', ['delete' => 'CASCADE'])
            ->create();

        // Booking
        $this->table('bookings', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('customer_id', 'uuid')
            ->addColumn('room_id', 'uuid')
            ->addColumn('check_in_date', 'date')
            ->addColumn('check_out_date', 'date')
            ->addColumn('status', 'enum', ['values' => ['booked', 'checked_in', 'checked_out', 'cancelled']])
            ->addColumn('special_requests', 'text', ['null' => true])
            ->addColumn('number_of_guests', 'integer')
            ->addColumn('total_amount', 'decimal', ['precision' => 10, 'scale' => 2])
            ->addTimestamps()
            ->addForeignKey('customer_id', 'customers', 'id', ['delete' => 'SET NULL'])
            ->addForeignKey('room_id', 'rooms', 'id', ['delete' => 'SET NULL'])
            ->create();

        // User
        $this->table('users', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('hotel_id', 'uuid')
            ->addColumn('name', 'string')
            ->addColumn('email', 'string')
            ->addColumn('phone', 'string')
            ->addColumn('password_hash', 'string')
            ->addColumn('role', 'enum', ['values' => ['receptionist', 'manager', 'ceo']])
            ->addColumn('is_active', 'boolean', ['default' => true])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('hotel_id', 'hotels', 'id', ['delete' => 'CASCADE'])
            ->create();

        // CheckIn
        $this->table('check_ins', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('booking_id', 'uuid')
            ->addColumn('checked_in_by', 'uuid')
            ->addColumn('checked_in_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('booking_id', 'bookings', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('checked_in_by', 'users', 'id')
            ->create();

        // CheckOut
        $this->table('check_outs', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('booking_id', 'uuid')
            ->addColumn('checked_out_by', 'uuid')
            ->addColumn('checked_out_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('additional_charges', 'decimal', ['precision' => 10, 'scale' => 2])
            ->addColumn('notes', 'text', ['null' => true])
            ->addForeignKey('booking_id', 'bookings', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('checked_out_by', 'users', 'id')
            ->create();

        // PaymentMethod
        $this->table('payment_methods', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('name', 'string')
            ->addColumn('details', 'jsonb', ['null' => true])
            ->addColumn('is_active', 'boolean', ['default' => true])
            ->create();

        // Payment
        $this->table('payments', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('booking_id', 'uuid')
            ->addColumn('payment_method_id', 'uuid')
            ->addColumn('amount', 'decimal', ['precision' => 10, 'scale' => 2])
            ->addColumn('paid_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('reference', 'string')
            ->addForeignKey('booking_id', 'bookings', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('payment_method_id', 'payment_methods', 'id')
            ->create();

        // Setting
        $this->table('settings', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', ['default' => 'uuid_generate_v4()'])
            ->addColumn('hotel_id', 'uuid')
            ->addColumn('key', 'string')
            ->addColumn('value', 'text')
            ->addColumn('description', 'string', ['null' => true])
            ->addForeignKey('hotel_id', 'hotels', 'id', ['delete' => 'CASCADE'])
            ->create();
    }
}