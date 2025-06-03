{
  "Hotel": {
    "id": "UUID",
    "name": "string",
    "address": "string",
    "city": "string",
    "country": "string",
    "phone": "string",
    "email": "string",
    "description": "text",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "RoomType": {
    "id": "UUID",
    "hotel_id": "UUID (FK: Hotel)",
    "name": "string",
    "description": "text",
    "price_per_night": "decimal",
    "max_occupancy": "integer",
    "amenities": "json",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "Room": {
    "id": "UUID",
    "hotel_id": "UUID (FK: Hotel)",
    "room_type_id": "UUID (FK: RoomType)",
    "room_number": "string",
    "floor": "integer",
    "status": "enum (available, occupied, maintenance, dirty)",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "Customer": {
    "id": "UUID",
    "full_name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "id_type": "string",
    "id_number": "string",
    "created_at": "timestamp"
  },
  "EmergencyContact": {
    "id": "UUID",
    "customer_id": "UUID (FK: Customer)",
    "name": "string",
    "relationship": "string",
    "phone": "string",
    "email": "string (optional)",
    "created_at": "timestamp"
  },
  "Booking": {
    "id": "UUID",
    "customer_id": "UUID (FK: Customer)",
    "room_id": "UUID (FK: Room)",
    "check_in_date": "date",
    "check_out_date": "date",
    "status": "enum (booked, checked_in, checked_out, cancelled)",
    "special_requests": "text",
    "number_of_guests": "integer",
    "total_amount": "decimal",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "CheckIn": {
    "id": "UUID",
    "booking_id": "UUID (FK: Booking)",
    "checked_in_by": "UUID (FK: User)",
    "checked_in_at": "timestamp"
  },
  "CheckOut": {
    "id": "UUID",
    "booking_id": "UUID (FK: Booking)",
    "checked_out_by": "UUID (FK: User)",
    "checked_out_at": "timestamp",
    "additional_charges": "decimal",
    "notes": "text"
  },
  "Payment": {
    "id": "UUID",
    "booking_id": "UUID (FK: Booking)",
    "payment_method_id": "UUID (FK: PaymentMethod)",
    "amount": "decimal",
    "paid_at": "timestamp",
    "reference": "string"
  },
  "PaymentMethod": {
    "id": "UUID",
    "name": "string (e.g., cash, card, mobile money)",
    "details": "json (e.g., account info if needed)",
    "is_active": "boolean"
  },
  "User": {
    "id": "UUID",
    "hotel_id": "UUID (FK: Hotel)",
    "name": "string",
    "email": "string",
    "phone": "string",
    "password_hash": "string",
    "role": "enum (receptionist, manager, ceo)",
    "is_active": "boolean",
    "created_at": "timestamp"
  },
  "Setting": {
    "id": "UUID",
    "hotel_id": "UUID (FK: Hotel)",
    "key": "string",
    "value": "text",
    "description": "string (optional)"
  }
}
