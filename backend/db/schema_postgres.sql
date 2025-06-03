-- ENUM definitions
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance', 'dirty');
CREATE TYPE booking_status AS ENUM ('booked', 'checked_in', 'checked_out', 'cancelled');
CREATE TYPE user_role AS ENUM ('receptionist', 'manager', 'ceo');

-- Hotel table
CREATE TABLE Hotel (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RoomType table
CREATE TABLE RoomType (
    id UUID PRIMARY KEY,
    hotel_id UUID REFERENCES Hotel(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    max_occupancy INT NOT NULL,
    amenities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room table
CREATE TABLE Room (
    id UUID PRIMARY KEY,
    hotel_id UUID REFERENCES Hotel(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES RoomType(id) ON DELETE SET NULL,
    room_number VARCHAR(20) NOT NULL,
    floor INT,
    status room_status DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer table
CREATE TABLE Customer (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EmergencyContact table
CREATE TABLE EmergencyContact (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES Customer(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking table
CREATE TABLE Booking (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES Customer(id) ON DELETE SET NULL,
    room_id UUID REFERENCES Room(id) ON DELETE SET NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status booking_status DEFAULT 'booked',
    special_requests TEXT,
    number_of_guests INT,
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CheckIn table
CREATE TABLE CheckIn (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES Booking(id) ON DELETE CASCADE,
    checked_in_by UUID REFERENCES "User"(id),
    checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CheckOut table
CREATE TABLE CheckOut (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES Booking(id) ON DELETE CASCADE,
    checked_out_by UUID REFERENCES "User"(id),
    checked_out_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_charges DECIMAL(10, 2),
    notes TEXT
);

-- PaymentMethod table
CREATE TABLE PaymentMethod (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    details JSONB,
    is_active BOOLEAN DEFAULT TRUE
);

-- Payment table
CREATE TABLE Payment (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES Booking(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES PaymentMethod(id),
    amount DECIMAL(10, 2) NOT NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(100)
);

-- User table
CREATE TABLE "User" (
    id UUID PRIMARY KEY,
    hotel_id UUID REFERENCES Hotel(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Setting table
CREATE TABLE Setting (
    id UUID PRIMARY KEY,
    hotel_id UUID REFERENCES Hotel(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    description VARCHAR(255)
);
