<?php
require_once __DIR__ . '/../model/Hotel.php';

/**
 * HotelController Class
 * 
 * Handles API requests related to hotel management.
 */
class HotelController
{
    private $hotelModel;

    public function __construct()
    {
        $this->hotelModel = new Hotel();
    }

    /**
     * Retrieve all hotels
     */
    public function getAllHotels(): string
    {
        $hotels = $this->hotelModel->getAll();

        return json_encode([
            'status' => !empty($hotels) ? 'success' : 'error',
            'hotels' => $hotels,
            'message' => empty($hotels) ? 'No hotels found' : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Retrieve a single hotel by ID
     */
    public function getHotelById(string $id): string
    {
        $hotel = $this->hotelModel->getById($id);

        return json_encode([
            'status' => $hotel ? 'success' : 'error',
            'hotel' => $hotel,
            'message' => !$hotel ? 'Hotel not found' : null
        ], JSON_PRETTY_PRINT);
    }

    /**
     * Create a new hotel
     */
    public function createHotel(array $data): string
    {
        $requiredFields = ['name', 'city', 'country'];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $missingFields[] = $field;
            }
        }

        if (!empty($missingFields)) {
            return json_encode([
                'status' => 'error',
                'message' => 'Missing required fields: ' . implode(', ', $missingFields)
            ], JSON_PRETTY_PRINT);
        }

        if ($this->hotelModel->create($data)) {
            return json_encode([
                'status' => 'success',
                'message' => 'Hotel created successfully.'
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to create hotel.',
                'error' => $this->hotelModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Update an existing hotel
     */
    public function updateHotel(string $id, array $data): string
    {
        if (!$this->hotelModel->getById($id)) {
            return json_encode([
                'status' => 'error',
                'message' => 'Hotel not found'
            ], JSON_PRETTY_PRINT);
        }

        if ($this->hotelModel->update($id, $data)) {
            return json_encode([
                'status' => 'success',
                'message' => 'Hotel updated successfully.'
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to update hotel.',
                'error' => $this->hotelModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Delete a hotel
     */
    public function deleteHotel(string $id): string
    {
        if (!$this->hotelModel->getById($id)) {
            return json_encode([
                'status' => 'error',
                'message' => 'Hotel not found'
            ], JSON_PRETTY_PRINT);
        }

        if ($this->hotelModel->delete($id)) {
            return json_encode([
                'status' => 'success',
                'message' => 'Hotel deleted successfully.'
            ], JSON_PRETTY_PRINT);
        } else {
            return json_encode([
                'status' => 'error',
                'message' => 'Failed to delete hotel.',
                'error' => $this->hotelModel->getLastError()
            ], JSON_PRETTY_PRINT);
        }
    }
}
