CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

-- Create foundational tables first (those referenced by others)
CREATE TABLE IF NOT EXISTS super_admins (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255),
    address TEXT,
    city VARCHAR(255),
    country VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotels (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255),
    address TEXT,
    city VARCHAR(255),
    country VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    name VARCHAR(255),
    description TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room_types (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    name VARCHAR(255),
    description TEXT,
    price_per_night DECIMAL(10, 2),
    max_occupancy INT,
    amenities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rooms (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    room_type_id CHAR(36),
    room_number VARCHAR(255),
    floor INT,
    status ENUM('available', 'occupied', 'maintenance', 'dirty'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    address TEXT,
    nationality VARCHAR(255),
    purpose_of_visit VARCHAR(255),
    id_type VARCHAR(255),
    id_number VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36),
    name VARCHAR(255),
    relationship VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    username VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255) NULL,
    phone VARCHAR(255),
    password_hash VARCHAR(255),
    role ENUM('receptionist', 'manager', 'ceo'),
    is_active BOOLEAN DEFAULT TRUE,
    first_login BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36),
    room_id CHAR(36),
    room_type_id CHAR(36),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    check_in_date DATE,
    check_out_date DATE,
    status ENUM('pending','booked', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
    special_requests TEXT,
    number_of_guests INT,
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS check_ins (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    booking_id CHAR(36),
    checked_in_by CHAR(36),
    checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (checked_in_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS check_outs (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    booking_id CHAR(36),
    checked_out_by CHAR(36),
    checked_out_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_charges DECIMAL(10, 2),
    notes TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (checked_out_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    name VARCHAR(255),
    details JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    booking_id CHAR(36),
    payment_method_id CHAR(36),
    amount DECIMAL(10, 2),
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    action VARCHAR(255),
    action_type ENUM('create', 'read', 'update', 'delete', 'login', 'logout', 'access', 'other') DEFAULT 'other',
    entity_type VARCHAR(255),
    entity_id CHAR(36),
    description TEXT,
    metadata JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE SET NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    hotel_id CHAR(36),
    branch_id CHAR(36),
    `key` VARCHAR(255),
    `value` TEXT,
    description VARCHAR(255),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS phinxlog (
    version BIGINT NOT NULL PRIMARY KEY,
    migration_name VARCHAR(100),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    breakpoint BOOLEAN DEFAULT FALSE
);
