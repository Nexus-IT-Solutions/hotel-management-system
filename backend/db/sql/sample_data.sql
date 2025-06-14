-- Use the database
USE hotel_db;

-- Disable foreign key checks for easier insertion (optional, but good for bulk inserts)
SET FOREIGN_KEY_CHECKS = 0;

-- Declare variables for UUIDs to maintain foreign key relationships
SET @super_admin_id_1 = UUID();
SET @hotel_id_1 = UUID();
SET @hotel_id_2 = UUID();
SET @branch_id_1_1 = UUID(); -- Branch 1 for Hotel 1
SET @branch_id_1_2 = UUID(); -- Branch 2 for Hotel 1
SET @branch_id_2_1 = UUID(); -- Branch 1 for Hotel 2

SET @room_type_id_1_1 = UUID(); -- Standard for Branch 1, Hotel 1
SET @room_type_id_1_2 = UUID(); -- Deluxe for Branch 1, Hotel 1
SET @room_type_id_2_1 = UUID(); -- Standard for Branch 1, Hotel 2

SET @room_id_1_1_1 = UUID(); -- Room 101, Standard, Branch 1, Hotel 1
SET @room_id_1_1_2 = UUID(); -- Room 102, Standard, Branch 1, Hotel 1
SET @room_id_1_2_1 = UUID(); -- Room 201, Deluxe, Branch 1, Hotel 1
SET @room_id_2_1_1 = UUID(); -- Room 301, Standard, Branch 1, Hotel 2

SET @customer_id_1 = UUID();
SET @customer_id_2 = UUID();
SET @customer_id_3 = UUID(); -- New customer
SET @customer_id_4 = UUID(); -- New customer

SET @user_id_hotel1_branch1_manager = UUID();
SET @user_id_hotel1_branch1_receptionist = UUID();
SET @user_id_hotel2_branch1_manager = UUID();

SET @booking_id_1 = UUID();
SET @booking_id_2 = UUID();
SET @booking_id_3 = UUID(); -- New booking
SET @booking_id_4 = UUID(); -- New booking
SET @booking_id_5 = UUID(); -- New booking
SET @booking_id_6 = UUID(); -- New booking

SET @payment_method_id_1 = UUID(); -- Credit Card for Hotel 1, Branch 1
SET @payment_method_id_2 = UUID(); -- Cash for Hotel 1, Branch 1

-- ----------------------------------------------------------------------
-- 1. Insert into super_admins
-- ----------------------------------------------------------------------
INSERT IGNORE INTO super_admins (id, name, address, city, country, phone, email, description) VALUES
(@super_admin_id_1, 'Admin User', '123 Global HQ', 'New York', 'USA', '+1-555-123-4567', 'admin@globalhotels.com', 'Primary Super Administrator');

-- ----------------------------------------------------------------------
-- 2. Insert into hotels
-- ----------------------------------------------------------------------
INSERT IGNORE INTO hotels (id, name, address, city, country, email, phone, description) VALUES
(@hotel_id_1, 'Grand Palace Hotel', '45 Park Avenue', 'Accra', 'Ghana', 'info@grandpalace.com', '+233-24-123-4567', 'A luxurious hotel in the heart of the city.'),
(@hotel_id_2, 'Ocean Breeze Resort', '789 Beach Road', 'Cape Coast', 'Ghana', 'reservations@oceanbreeze.com', '+233-50-987-6543', 'Relaxing resort by the ocean.');

-- ----------------------------------------------------------------------
-- 3. Insert into branches
-- ----------------------------------------------------------------------
INSERT IGNORE INTO branches (id, hotel_id, name, description, address) VALUES
(@branch_id_1_1, @hotel_id_1, 'Downtown Branch', 'The main branch in the city center.', '45 Park Avenue, Accra'),
(@branch_id_1_2, @hotel_id_1, 'Airport Branch', 'Conveniently located near the airport.', '10 Airport Road, Accra'),
(@branch_id_2_1, @hotel_id_2, 'Main Resort', 'The primary resort property.', '789 Beach Road, Cape Coast');

-- ----------------------------------------------------------------------
-- 4. Insert into room_types
-- ----------------------------------------------------------------------
INSERT IGNORE INTO room_types (id, hotel_id, branch_id, name, description, price_per_night, max_occupancy, amenities, updated_at) VALUES
(@room_type_id_1_1, @hotel_id_1, @branch_id_1_1, 'Standard Room', 'Comfortable room with basic amenities.', 150.00, 2, '{"wifi": true, "tv": true, "minibar": false, "breakfast_included": true}', NULL),
(@room_type_id_1_2, @hotel_id_1, @branch_id_1_1, 'Deluxe Suite', 'Spacious suite with city views and premium amenities.', 300.00, 4, '{"wifi": true, "tv": true, "minibar": true, "jacuzzi": true, "breakfast_included": true}', NULL),
(@room_type_id_2_1, @hotel_id_2, @branch_id_2_1, 'Ocean View Room', 'Room with stunning ocean views.', 220.00, 3, '{"wifi": true, "balcony": true, "ac": true, "beach_access": true}', NULL);

-- ----------------------------------------------------------------------
-- 5. Insert into rooms
-- ----------------------------------------------------------------------
INSERT IGNORE INTO rooms (id, hotel_id, branch_id, room_type_id, room_number, floor, status, updated_at) VALUES
(@room_id_1_1_1, @hotel_id_1, @branch_id_1_1, @room_type_id_1_1, '101', 1, 'available', NULL),
(@room_id_1_1_2, @hotel_id_1, @branch_id_1_1, @room_type_id_1_1, '102', 1, 'available', NULL),
(@room_id_1_2_1, @hotel_id_1, @branch_id_1_1, @room_type_id_1_2, '201', 2, 'available', NULL),
(@room_id_2_1_1, @hotel_id_2, @branch_id_2_1, @room_type_id_2_1, '301', 3, 'available', NULL);

-- ----------------------------------------------------------------------
-- 6. Insert into customers
-- ----------------------------------------------------------------------
INSERT IGNORE INTO customers (id, full_name, email, phone, address, nationality, purpose_of_visit, id_type, id_number) VALUES
(@customer_id_1, 'Ama Serwaa', 'ama.serwaa@example.com', '+233-20-111-2222', 'P.O. Box 123, Accra', 'Ghanaian', 'Tourism', 'Ghana Card', 'GHA-123456789-0'),
(@customer_id_2, 'John Doe', 'john.doe@example.com', '+1-202-555-0100', '100 Main St, Washington DC', 'American', 'Business', 'Passport', 'A123B456C'),
(@customer_id_3, 'Kwadwo Adom', 'kwadwo.adom@example.com', '+233-27-789-0123', 'House No. 5, Kumasi', 'Ghanaian', 'Family Visit', 'Voter ID', 'GHV-987654321-1'),
(@customer_id_4, 'Maria Garcia', 'maria.garcia@example.com', '+34-600-123-456', 'Calle Mayor 10, Madrid', 'Spanish', 'Tourism', 'Passport', 'ES-78901234F');

-- ----------------------------------------------------------------------
-- 7. Insert into emergency_contacts
-- ----------------------------------------------------------------------
INSERT IGNORE INTO emergency_contacts (id, customer_id, name, relationship, phone, email) VALUES
(UUID(), @customer_id_1, 'Kwame Mensah', 'Brother', '+233-24-333-4444', 'kwame.mensah@example.com'),
(UUID(), @customer_id_2, 'Jane Doe', 'Wife', '+1-202-555-0101', 'jane.doe@example.com'),
(UUID(), @customer_id_3, 'Akua Adom', 'Mother', '+233-26-123-4567', 'akua.adom@example.com'),
(UUID(), @customer_id_4, 'Pedro Garcia', 'Father', '+34-600-987-654', 'pedro.garcia@example.com');

-- ----------------------------------------------------------------------
-- 8. Insert into users
-- ----------------------------------------------------------------------
INSERT IGNORE INTO users (id, hotel_id, branch_id, username, name, email, phone, password_hash, role, last_login) VALUES
(@user_id_hotel1_branch1_manager, @hotel_id_1, @branch_id_1_1, 'manager1', 'Esi Mensah', 'esi.mensah@grandpalace.com', '+233-20-555-1111', 'hashed_password_manager', 'manager', NOW()),
(@user_id_hotel1_branch1_receptionist, @hotel_id_1, @branch_id_1_1, 'receptionist1', 'Kofi Nkrumah', 'kofi.nkrumah@grandpalace.com', '+233-24-666-2222', 'hashed_password_receptionist', 'receptionist', NULL),
(@user_id_hotel2_branch1_manager, @hotel_id_2, @branch_id_2_1, 'resort_manager', 'Adwoa Boateng', 'adwoa.boateng@oceanbreeze.com', '+233-50-777-3333', 'hashed_password_adwoa', 'manager', NOW());

-- ----------------------------------------------------------------------
-- 9. Insert into bookings
-- ----------------------------------------------------------------------
INSERT IGNORE INTO bookings (id, customer_id, room_id, room_type_id, hotel_id, branch_id, check_in_date, check_out_date, status, special_requests, number_of_guests, total_amount, updated_at) VALUES
(@booking_id_1, @customer_id_1, @room_id_1_1_1, @room_type_id_1_1, @hotel_id_1, @branch_id_1_1, '2025-07-01', '2025-07-05', 'booked', 'Non-smoking room, extra pillow', 1, 600.00, NULL),
(@booking_id_2, @customer_id_2, @room_id_1_2_1, @room_type_id_1_2, @hotel_id_1, @branch_id_1_1, '2025-07-10', '2025-07-12', 'pending', 'Late check-out requested', 2, 600.00, NULL),
(@booking_id_3, @customer_id_3, @room_id_1_1_2, @room_type_id_1_1, @hotel_id_1, @branch_id_1_1, '2025-07-15', '2025-07-17', 'booked', 'Room with twin beds', 2, 300.00, NULL),
(@booking_id_4, @customer_id_4, @room_id_2_1_1, @room_type_id_2_1, @hotel_id_2, @branch_id_2_1, '2025-08-01', '2025-08-07', 'pending', 'High floor preferred, ocean view', 3, 1320.00, NULL),
(@booking_id_5, @customer_id_1, @room_id_1_1_1, @room_type_id_1_1, @hotel_id_1, @branch_id_1_1, '2025-08-20', '2025-08-22', 'booked', 'Quiet room', 1, 300.00, NULL),
(@booking_id_6, @customer_id_2, @room_id_1_2_1, @room_type_id_1_2, @hotel_id_1, @branch_id_1_1, '2025-09-01', '2025-09-03', 'booked', 'King-size bed', 2, 600.00, NULL);


-- ----------------------------------------------------------------------
-- 10. Insert into check_ins
-- ----------------------------------------------------------------------
INSERT IGNORE INTO check_ins (id, hotel_id, branch_id, booking_id, checked_in_by, checked_in_at) VALUES
(UUID(), @hotel_id_1, @branch_id_1_1, @booking_id_1, @user_id_hotel1_branch1_receptionist, NOW()),
(UUID(), @hotel_id_1, @branch_id_1_1, @booking_id_3, @user_id_hotel1_branch1_receptionist, NOW());


-- ----------------------------------------------------------------------
-- 11. Insert into check_outs (example of a past checkout)
-- ----------------------------------------------------------------------
-- Assume booking_id_past exists from a previous scenario or just simulate
SET @booking_id_past = UUID();
INSERT IGNORE INTO bookings (id, customer_id, room_id, room_type_id, hotel_id, branch_id, check_in_date, check_out_date, status, special_requests, number_of_guests, total_amount, updated_at) VALUES
(@booking_id_past, @customer_id_1, @room_id_1_1_2, @room_type_id_1_1, @hotel_id_1, @branch_id_1_1, '2025-06-01', '2025-06-03', 'checked_out', 'Early check-in', 1, 300.00, NOW());

INSERT IGNORE INTO check_outs (id, hotel_id, branch_id, booking_id, checked_out_by, checked_out_at, additional_charges, notes) VALUES
(UUID(), @hotel_id_1, @branch_id_1_1, @booking_id_past, @user_id_hotel1_branch1_receptionist, NOW(), 25.00, 'Mini-bar consumption.');

-- ----------------------------------------------------------------------
-- 12. Insert into payment_methods
-- ----------------------------------------------------------------------
INSERT IGNORE INTO payment_methods (id, hotel_id, branch_id, name, details, is_active) VALUES
(@payment_method_id_1, @hotel_id_1, @branch_id_1_1, 'Credit Card (Visa)', '{"type": "credit_card", "card_network": "Visa", "fees": 0.02}', TRUE),
(@payment_method_id_2, @hotel_id_1, @branch_id_1_1, 'Cash', '{"type": "cash", "currency": "GHS"}', TRUE),
(UUID(), @hotel_id_2, @branch_id_2_1, 'Mobile Money (MTN)', '{"type": "mobile_money", "provider": "MTN", "country": "Ghana"}', TRUE);

-- ----------------------------------------------------------------------
-- 13. Insert into payments
-- ----------------------------------------------------------------------
INSERT IGNORE INTO payments (id, hotel_id, branch_id, booking_id, payment_method_id, amount, paid_at, reference, status, notes, updated_at) VALUES
(UUID(), @hotel_id_1, @branch_id_1_1, @booking_id_1, @payment_method_id_1, 600.00, NOW(), 'TXN-ABC-12345', 'completed', 'Full payment for booking 1', NOW()),
(UUID(), @hotel_id_1, @branch_id_1_1, @booking_id_2, @payment_method_id_2, 300.00, NOW(), 'TXN-XYZ-67890', 'pending', 'Partial payment for booking 2', NOW()),
(UUID(), @hotel_id_1, @branch_id_1_1, @booking_id_3, @payment_method_id_1, 300.00, NOW(), 'TXN-DEF-98765', 'completed', 'Full payment for booking 3', NOW()),
(UUID(), @hotel_id_2, @branch_id_2_1, @booking_id_4, (SELECT id FROM payment_methods WHERE name = 'Mobile Money (MTN)' LIMIT 1), 1320.00, NOW(), 'TXN-GHI-11223', 'pending', 'Initial payment for booking 4', NOW()),
(UUID(), @hotel_id_1, @branch_id_1_1, @booking_id_5, @payment_method_id_1, 300.00, NOW(), 'TXN-JKL-44556', 'completed', 'Full payment for booking 5', NOW());


-- ----------------------------------------------------------------------
-- 14. Insert into audit_logs
-- ----------------------------------------------------------------------
INSERT IGNORE INTO audit_logs (id, user_id, hotel_id, branch_id, action, action_type, entity_type, entity_id, description, metadata, ip_address, user_agent, success) VALUES
(UUID(), @user_id_hotel1_branch1_receptionist, @hotel_id_1, @branch_id_1_1, 'Created booking', 'create', 'booking', @booking_id_1, 'New booking created by receptionist for customer Ama Serwaa.', '{"user_role": "receptionist"}', '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', TRUE),
(UUID(), @user_id_hotel1_branch1_manager, @hotel_id_1, @branch_id_1_1, 'Updated room status', 'update', 'room', @room_id_1_1_1, 'Room 101 status changed to occupied.', '{"old_status": "available", "new_status": "occupied"}', '10.0.0.5', 'PostmanRuntime/7.30.0', TRUE),
(UUID(), @user_id_hotel1_branch1_receptionist, @hotel_id_1, @branch_id_1_1, 'Created booking', 'create', 'booking', @booking_id_3, 'New booking created by receptionist for customer Kwadwo Adom.', '{"user_role": "receptionist"}', '192.168.1.11', 'Mozilla/5.0', TRUE),
(UUID(), @user_id_hotel2_branch1_manager, @hotel_id_2, @branch_id_2_1, 'Created booking', 'create', 'booking', @booking_id_4, 'New booking created by manager for customer Maria Garcia.', '{"user_role": "manager"}', '10.0.0.6', 'PostmanRuntime/7.30.0', TRUE);


-- ----------------------------------------------------------------------
-- 15. Insert into settings
-- ----------------------------------------------------------------------
INSERT IGNORE INTO settings (id, hotel_id, branch_id, `key`, `value`, description) VALUES
(UUID(), @hotel_id_1, NULL, 'default_currency', 'GHS', 'Default currency for the hotel'),
(UUID(), @hotel_id_1, @branch_id_1_1, 'check_in_time', '14:00', 'Standard check-in time for Downtown Branch'),
(UUID(), @hotel_id_1, @branch_id_1_1, 'check_out_time', '11:00', 'Standard check-out time for Downtown Branch'),
(UUID(), @hotel_id_2, NULL, 'vat_rate', '0.18', 'VAT rate for Hotel 2');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Optional: Verify data
-- SELECT * FROM hotels;
-- SELECT * FROM branches;
-- SELECT * FROM room_types;
-- SELECT * FROM rooms;
-- SELECT * FROM customers;
-- SELECT * FROM users;
-- SELECT * FROM bookings;
-- SELECT * FROM payments;
-- SELECT * FROM audit_logs;
