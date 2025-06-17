<?php
require_once __DIR__ . '/../model/Booking.php';

/**
 * BookingController
 * * Handles HTTP requests related to bookings.
 */
class BookingController
{
    private $bookingModel;

    public function __construct()
    {
        $this->bookingModel = new Booking();
    }

    /**
     * Get all bookings
     */
    public function getAllBookingSummary(): string
    {
        $bookings = $this->bookingModel->getAllBookingSummary();
        return json_encode([
            'status' => !empty($bookings) ? 'success' : 'error',
            'bookings' => $bookings,
            'message' => !empty($bookings) ? null : 'No bookings found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get a single booking by ID
     */
    public function getBookingById(string $id): string
    {
        $booking = $this->bookingModel->getById($id);
        return json_encode([
            'status' => !empty($booking) ? 'success' : 'error',
            'booking' => $booking,
            'message' => !empty($booking) ? null : 'Booking not found'
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Get booking by booking code
     * 
     */
    public function getBookingByCode(string $code): string
    {
        $booking = $this->bookingModel->getByBookingCode($code);
        return json_encode([
            'status' => !empty($booking) ? 'success' : 'error',
            'booking' => $booking,
            'message' => !empty($booking) ? null : 'Booking not found'
        ], JSON_PRETTY_PRINT);
    }


    /**
     * Create a new booking
     */
    public function createBooking(array $data): string
    {
        $booking = $this->bookingModel->create($data);
        return json_encode([
            'status' => $booking ? 'success' : 'error',
            'booking' => $booking,
            'message' => $booking ? 'Booking created successfully' : $this->bookingModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Update a booking
     */
    public function updateBooking(string $id, array $data): string
    {
        $success = $this->bookingModel->update($id, $data);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Booking updated successfully' : $this->bookingModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Delete a booking
     */
    public function deleteBooking(string $id): string
    {
        $success = $this->bookingModel->delete($id);
        return json_encode([
            'status' => $success ? 'success' : 'error',
            'message' => $success ? 'Booking deleted successfully' : $this->bookingModel->getLastError()
        ], JSON_PRETTY_PRINT);
    }
}
