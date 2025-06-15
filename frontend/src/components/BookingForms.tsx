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
}

export default function BookingForm() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(''); // State for selected room

  // State variables for form inputs
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [address, setAddress] = useState<string>(''); // New: Address
  const [nationality, setNationality] = useState<string>(''); // New: Nationality
  const [purposeOfVisit, setPurposeOfVisit] = useState<string>(''); // New: Purpose of Visit
  const [idType, setIdType] = useState<string>(''); // New: ID Type
  const [idNumber, setIdNumber] = useState<string>(''); // New: ID Number
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState<string>('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [checkOutDate, setCheckOutDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Effect to fetch room types on component mount
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        // Retrieve user data from localStorage
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userBranchId = userData.user.branch_id;
        // Fetch room types for the specific branch
        const response = await axios.get(`https://hotel-management-system-5gk8.onrender.com/v1/room-types/branch/${userBranchId}`);
        setRoomTypes(response.data.data || []);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };
    fetchRoomTypes();
  }, []);

  // Effect to fetch available rooms when selectedRoomTypeId changes
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (selectedRoomTypeId) {
        try {
          // Fetch available rooms for the selected room type
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
  }, [selectedRoomTypeId]); // Dependency array includes selectedRoomTypeId

  // Handle change for room type selection
  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomTypeId = e.target.value;
    setSelectedRoomTypeId(roomTypeId);
    setSelectedRoomId(''); // Reset selected room when room type changes
  };

  // Handle change for available room selection
  const handleAvailableRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoomId(e.target.value);
  };

  // Calculate the number of nights
  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  // Calculate the total amount
  const calculateTotalAmount = () => {
    const selectedRoomType = roomTypes.find(rt => rt.id === selectedRoomTypeId);
    const nights = calculateNights();
    if (selectedRoomType && nights > 0) {
      return parseFloat(selectedRoomType.price_per_night) * nights;
    }
    return 0;
  };

  const totalNights = calculateNights();
  const totalAmount = calculateTotalAmount();


// Handle form submission
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  try {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    
    // Prepare booking data with all fields
    const bookingData = {
      customer_name: customerName,
      phone_number: phoneNumber,
      email_address: emailAddress,
      address,
      nationality,
      purpose_of_visit: purposeOfVisit,
      id_type: idType,
      id_number: idNumber,
      emergency_contact_name: emergencyContactName,
      emergency_contact_relationship: emergencyContactRelationship,
      emergency_contact_phone: emergencyContactPhone,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      room_type_id: selectedRoomTypeId,
      room_id: selectedRoomId,
      number_of_guests: numberOfGuests,
      special_requests: specialRequests,
      payment_method: paymentMethod,
      nights: totalNights,
      total_amount: totalAmount,
      hotel_id: userData.user.hotel_id,
      branch_id: userData.user.branch_id,
    };

    // Make API call to create booking
    const response = await axios.post(
      'http://hotel-management-system-5gk8.onrender.com/v1/bookings/new', 
      bookingData
    );
    
    console.log('Booking successful:', response.data);
    alert('Booking created successfully!');
    
    // Reset form or redirect to bookings list
    // You could add navigation here or clear the form
    
  } catch (error) {
    console.error('Booking failed:', error);
    alert('Failed to create booking. Please try again.');
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotel and Branch Id (Hidden Inputs) */}
        <input
          type="hidden"
          name="hotelId"
          value={JSON.parse(localStorage.getItem("userData") || "{}").user.hotel_id}
        />
        <input
          type="hidden"
          name="branchId"
          value={JSON.parse(localStorage.getItem("userData") || "{}").user.branch_id}
        />

        {/* This div will contain Customer Info and Booking Details, spanning 2 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-2 gap-6"> {/* Nested grid */}
          {/* Customer Information */}
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
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>

              {/* New: Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter customer's address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* New: Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter customer's nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
              </div>

              {/* New: Purpose of Visit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Visit
                </label>
                <input
                  type="text"
                  name="purpose_of_visit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Business, Leisure, Family Visit"
                  value={purposeOfVisit}
                  onChange={(e) => setPurposeOfVisit(e.target.value)}
                />
              </div>

              {/* New: ID Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Type
                </label>
                <select
                  name="id_type"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                >
                  <option value="">Select ID Type</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="National ID">National ID</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* New: ID Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  name="id_number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter ID number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />
              </div>
            </div>

         
          </div>

          {/* Booking Details and Payment Method */}
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
                      defaultValue={checkInDate}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                      onChange={(e) => setCheckInDate(e.target.value)}
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
                      onChange={(e) => setCheckOutDate(e.target.value)}
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

                {selectedRoomTypeId && (
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
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
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
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>

                   {/* Emergency Contact */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-red-600" />
                Emergency Contact
              </h3>

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
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
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
                  value={emergencyContactRelationship}
                  onChange={(e) => setEmergencyContactRelationship(e.target.value)}
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
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                />
              </div>
                </div>
                
              </div>

            </div>

          
          </div>
        </div>

        {/* Booking Summary (This will naturally fall into the last column due to the parent grid) */}
        <div className="space-y-6">
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
                    value="Cash"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                    checked={paymentMethod === 'Cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-gray-700 text-sm">Cash</span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                    checked={paymentMethod === 'Credit Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-gray-700 text-sm">Credit Card</span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Mobile Money"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                    checked={paymentMethod === 'Mobile Money'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-gray-700 text-sm">Mobile Money</span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                    checked={paymentMethod === 'Bank Transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-gray-700 text-sm">Bank Transfer</span>
                </label>
              </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Bed className="w-5 h-5 mr-2 text-orange-600" />
              Booking Summary
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">
                  {customerName || "Not Selected"}
                </span>
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
                <span className="font-medium">
                  {checkInDate || "Not Selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">
                  {checkOutDate || "Not Selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nights:</span>
                <span className="font-medium">
                  {totalNights > 0 ? `${totalNights} Night(s)` : "Check-out Date not Selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">
                  {numberOfGuests > 0 ? `${numberOfGuests} Guest(s)` : "Not Selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className="font-medium">
                  {paymentMethod || "Not Selected"}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">${totalAmount.toFixed(2)}</span>
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
              onClick={() => {
                // Reset all form fields
                setCustomerName('');
                setPhoneNumber('');
                setEmailAddress('');
                setAddress(''); // Reset new fields
                setNationality(''); // Reset new fields
                setPurposeOfVisit(''); // Reset new fields
                setIdType(''); // Reset new fields
                setIdNumber(''); // Reset new fields
                setEmergencyContactName('');
                setEmergencyContactRelationship('');
                setEmergencyContactPhone('');
                setCheckInDate(new Date().toISOString().split("T")[0]);
                setCheckOutDate(new Date().toISOString().split("T")[0]);
                setNumberOfGuests(1);
                setSpecialRequests('');
                setPaymentMethod('');
                setSelectedRoomTypeId('');
                setSelectedRoomId('');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}