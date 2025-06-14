import { User, CreditCard, Calendar, Bed, X, Check } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

// Define interfaces for room data
interface RoomType {
  id: string;
  name: string;
  description: string;
  price_per_night: string;
  max_occupancy: number;
  amenities: string;
}

// Interface for available room data
interface AvailableRoom {
  id: string;
  room_number: string;
  room_type_id: string;
  is_available: boolean;
  // Add other properties of an available room if they exist in your API response
}

export default function BookingForm() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(''); // New state for selected room

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userBranchId = userData.user.branch_id;
        const response = await axios.get(`https://hotel-management-system-5gk8.onrender.com/v1/room-types/branch/${userBranchId}`);
        console.log(response.data);
        console.log(userBranchId);
        setRoomTypes(response.data.data || []);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (selectedRoomTypeId) {
        try {
          const response = await axios.get(`https://hotel-management-system-5gk8.onrender.com/v1/rooms/available/room-type/${selectedRoomTypeId}`);
          setAvailableRooms(response.data.availableRooms || []);
        } catch (error) {
          console.error("Error fetching available rooms:", error);
          setAvailableRooms([]);
        }
      } else {
        setAvailableRooms([]);
      }
    };

    fetchAvailableRooms();
  }, [selectedRoomTypeId]); // Re-fetch when selectedRoomTypeId changes

  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomTypeId = e.target.value;
    setSelectedRoomTypeId(roomTypeId);
    setSelectedRoomId(''); // Reset selected room when room type changes
  };

  const handleAvailableRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoomId(e.target.value);
  };

  return (
    <form action="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* customer information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Customer Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter customer's full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="customer@example.com"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-green-600" />
              Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Cash</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Credit Card</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Mobile Money</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Bank Transfer</span>
              </label>
            </div>
          </div>
        </div>

        {/* booking details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Booking Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  name="roomType"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  value={selectedRoomTypeId}
                  onChange={handleRoomTypeChange}
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((roomType) => (
                    <option key={roomType.id} value={roomType.id}>
                      {roomType.name} - ${roomType.price_per_night}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRoomTypeId && ( // Only show if a room type is selected
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Room *
                  </label>
                  <select
                    name="availableRoom"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    value={selectedRoomId}
                    onChange={handleAvailableRoomChange}
                    disabled={availableRooms.length === 0}
                  >
                    <option value="">
                      {availableRooms.length > 0 ? "Select a Room" : "No Available Rooms for this type"}
                    </option>
                    {availableRooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        Room Number: {room.room_number}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <select
                  name="guests"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  rows={3}
                  className="w-full px-4 py-1 h-[80px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Bed className="w-5 h-5 mr-2 text-orange-600" />
              Booking Summary
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">Not Selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium">
                  {roomTypes.find(rt => rt.id === selectedRoomTypeId)?.name || "Not Selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Number:</span>
                <span className="font-medium">
                  {availableRooms.find(ar => ar.id === selectedRoomId)?.room_number || "Not Selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium"> Not Selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium"> Not Selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nights:</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className="font-medium">Not Selected</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">$234</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Create Booking
            </button>

            <button
              type="button"
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-red-600" />
            Emergency Contact
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Name *
              </label>
              <input
                type="text"
                name="emergency_contact_name"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship *
              </label>
              <select
                name="emergency_contact_relationship"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">Select relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="child">Child</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Phone *
              </label>
              <input
                type="tel"
                name="emergency_contact_phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}