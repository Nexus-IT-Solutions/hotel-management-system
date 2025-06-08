<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;
use Faker\Factory;
use Ramsey\Uuid\Uuid;

class HotelManagementSeeder extends AbstractSeed
{
    public function run(): void
    {
        $faker = Factory::create();

        // Create 1 hotel
        $hotelId = Uuid::uuid4()->toString();
        $this->table('hotels')->insert([
            [
                'id' => $hotelId,
                'name' => $faker->company . ' Hotel',
                'address' => $faker->streetAddress,
                'city' => $faker->city,
                'country' => $faker->country,
                'phone' => $faker->phoneNumber,
                'email' => $faker->companyEmail,
                'description' => $faker->sentence,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ])->saveData();

        // Room Types (2 types)
        $roomTypes = [];
        for ($i = 0; $i < 2; $i++) {
            $roomTypes[] = [
                'id' => Uuid::uuid4()->toString(),
                'hotel_id' => $hotelId,
                'name' => $faker->randomElement(['Deluxe', 'Standard', 'Executive', 'Family']),
                'description' => $faker->sentence,
                'price_per_night' => $faker->randomFloat(2, 100, 1000),
                'max_occupancy' => $faker->numberBetween(1, 4),
                'amenities' => json_encode($faker->randomElements(['Wi-Fi', 'AC', 'TV', 'Fridge', 'Balcony'], 3)),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
        }
        $this->table('room_types')->insert($roomTypes)->saveData();

        // Rooms (3 rooms per room type)
        $rooms = [];
        foreach ($roomTypes as $roomType) {
            for ($i = 0; $i < 3; $i++) {
                $rooms[] = [
                    'id' => Uuid::uuid4()->toString(),
                    'hotel_id' => $hotelId,
                    'room_type_id' => $roomType['id'],
                    'room_number' => $faker->unique()->numberBetween(100, 999),
                    'floor' => $faker->numberBetween(1, 3),
                    'status' => 'available',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
            }
        }
        $this->table('rooms')->insert($rooms)->saveData();

        // Customers (4)
        $customers = [];
        for ($i = 0; $i < 4; $i++) {
            $customers[] = [
                'id' => Uuid::uuid4()->toString(),
                'full_name' => $faker->name,
                'email' => $faker->email,
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
                'id_type' => 'National ID',
                'id_number' => 'GHA-' . $faker->numerify('#########'),
                'created_at' => date('Y-m-d H:i:s'),
            ];
        }
        $this->table('customers')->insert($customers)->saveData();

        // Emergency Contacts (1 per customer)
        $contacts = [];
        foreach ($customers as $customer) {
            $contacts[] = [
                'id' => Uuid::uuid4()->toString(),
                'customer_id' => $customer['id'],
                'name' => $faker->name,
                'relationship' => $faker->randomElement(['Parent', 'Sibling', 'Friend']),
                'phone' => $faker->phoneNumber,
                'email' => $faker->safeEmail,
                'created_at' => date('Y-m-d H:i:s'),
            ];
        }
        $this->table('emergency_contacts')->insert($contacts)->saveData();

        // Admin user
        $userId = Uuid::uuid4()->toString();
        $this->table('users')->insert([
            [
                'id' => $userId,
                'hotel_id' => $hotelId,
                'name' => 'Admin',
                'email' => 'admin@' . $faker->domainName,
                'phone' => $faker->phoneNumber,
                'password_hash' => password_hash('admin123', PASSWORD_BCRYPT),
                'role' => 'admin',
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
            ]
        ])->saveData();

        // Payment Methods (2)
        $methods = [];
        for ($i = 0; $i < 2; $i++) {
            $methods[] = [
                'id' => Uuid::uuid4()->toString(),
                'name' => $faker->randomElement(['Mobile Money', 'Visa', 'Cash']),
                'details' => json_encode(['info' => $faker->word]),
                'is_active' => true,
            ];
        }
        $this->table('payment_methods')->insert($methods)->saveData();

        // Bookings, Check-ins, Payments (1 per customer)
        foreach ($customers as $i => $customer) {
            $bookingId = Uuid::uuid4()->toString();
            $room = $rooms[$i]; // assign room to customer
            $paymentMethod = $methods[$i % count($methods)];

            $this->table('bookings')->insert([
                [
                    'id' => $bookingId,
                    'customer_id' => $customer['id'],
                    'room_id' => $room['id'],
                    'check_in_date' => date('Y-m-d'),
                    'check_out_date' => date('Y-m-d', strtotime('+2 days')),
                    'status' => 'booked',
                    'special_requests' => $faker->sentence,
                    'number_of_guests' => $faker->numberBetween(1, 4),
                    'total_amount' => 800.00,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]
            ])->saveData();

            $this->table('check_ins')->insert([
                [
                    'id' => Uuid::uuid4()->toString(),
                    'booking_id' => $bookingId,
                    'checked_in_by' => $userId,
                    'checked_in_at' => date('Y-m-d H:i:s'),
                ]
            ])->saveData();

            $this->table('payments')->insert([
                [
                    'id' => Uuid::uuid4()->toString(),
                    'booking_id' => $bookingId,
                    'payment_method_id' => $paymentMethod['id'],
                    'amount' => 800.00,
                    'paid_at' => date('Y-m-d H:i:s'),
                    'reference' => strtoupper($faker->bothify('PAY###???')),
                ]
            ])->saveData();
        }

        // Check-Outs (1 per booking)
        foreach ($customers as $i => $customer) {
            $bookingId = $this->fetchRow("SELECT id FROM bookings WHERE customer_id = '{$customer['id']}'")['id'];
            $this->table('check_outs')->insert([
                [
                    'id' => Uuid::uuid4()->toString(),
                    'booking_id' => $bookingId,
                    'checked_out_by' => $userId,
                    'checked_out_at' => date('Y-m-d H:i:s', strtotime('+2 days')),
                    'additional_charges' => $faker->randomFloat(2, 0, 100),
                    'notes' => $faker->sentence,
                ]
            ])->saveData();
        }

        // Settings (1 example)
        $this->table('settings')->insert([
            [
                'id' => Uuid::uuid4()->toString(),
                'hotel_id' => $hotelId,
                'key' => 'default_check_in_time',
                'value' => '14:00',
                'description' => 'Check-in time',
            ],
        ])->saveData();
    }
}