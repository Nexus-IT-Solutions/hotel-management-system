import { Bed, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface RoomType {
  id: string;
  name: string;
  description: string;
  price_per_night: string;
  max_occupancy: number;
  amenities: Record<string, boolean>;
}

interface Room {
  id: string;
  hotel_id: string;
  branch_id: string;
  room_type_id: string | null;
  room_number: string;
  floor: number;
  status: string;
  created_at: string;
  updated_at: string | null;
}

interface BranchRoom {
  room_type: RoomType;
  rooms: Room[];
}

interface ApiResponse {
  status: string;
  branchRooms: BranchRoom[];
  message: string | null;
}

export default function AddRoomForms() {
  const [branchRooms, setBranchRooms] = useState<BranchRoom[]>([]);
  const [availableRoomNumbers, setAvailableRoomNumbers] = useState<string[]>([]);
  const [availableFloors, setAvailableFloors] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    roomFloor: "",
    roomPrice: 0,
    roomCapacity: 0,
    amenities: [] as string[],
    hotelId: "",
    branchId: "",
  });

  const amenitiesMap: Record<string, string> = {
    "Air Condition": "ac",
    Television: "tv",
    Refrigerator: "fridge",
    Jacuzzi: "jacuzzi",
    Fan: "fan",
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsed = JSON.parse(userData);
      const hotelId = parsed?.user?.hotel_id;
      const branchId = parsed?.user?.branch_id;
      setFormData((prev) => ({
        ...prev,
        hotelId: hotelId,
        branchId: branchId,
      }));
    }

    // Fetch branch rooms data
    fetchBranchRooms();
  }, []);

  const fetchBranchRooms = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        "https://api.placeholder.com/v1/branch-rooms" // Placeholder API endpoint
      );
      setBranchRooms(response.data.branchRooms || []);
    } catch (err) {
      console.error("Failed to fetch branch rooms", err);
    }
  };

  // Update available room numbers and floors when room type changes
  useEffect(() => {
    if (formData.roomType) {
      const selectedRoomType = branchRooms.find(
        (branchRoom) => branchRoom.room_type?.id === formData.roomType
      );
      
      if (selectedRoomType) {
        const roomNumbers = selectedRoomType.rooms.map(room => room.room_number);
        const floors = [...new Set(selectedRoomType.rooms.map(room => room.floor))];
        
        setAvailableRoomNumbers(roomNumbers);
        setAvailableFloors(floors.sort((a, b) => a - b));
      }
    } else {
      setAvailableRoomNumbers([]);
      setAvailableFloors([]);
    }
    
    // Reset room number and floor when room type changes
    setFormData(prev => ({
      ...prev,
      roomNumber: "",
      roomFloor: ""
    }));
  }, [formData.roomType, branchRooms]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = target instanceof HTMLInputElement ? target.checked : false;

    if (name === "amenities") {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((a) => a !== value);
        return { ...prev, amenities: updated };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedAmenities = formData.amenities.reduce((acc, item) => {
      const key = amenitiesMap[item];
      if (key) acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);

    const payload = {
      room_number: formData.roomNumber,
      room_type_id: formData.roomType,
      floor: parseInt(formData.roomFloor),
      status: "available",
      hotel_id: formData.hotelId,
      branch_id: formData.branchId,
      price: formData.roomPrice,
      capacity: formData.roomCapacity,
      amenities: formattedAmenities,
    };

    try {
      // Placeholder API endpoint for creating room
      const res = await axios.post(
        "https://api.placeholder.com/v1/rooms/create",
        payload
      );
      alert(res.data.message || "Room created successfully!");
      setFormData((prev) => ({
        ...prev,
        roomNumber: "",
        roomType: "",
        roomFloor: "",
        roomPrice: 0,
        roomCapacity: 0,
        amenities: [],
      }));
    } catch (err: any) {
      console.error("Room creation failed:", err);
      alert(err?.response?.data?.message || "Room creation failed");
    }
  };

  // Get room types for dropdown (filter out null room types)
  const roomTypes = branchRooms
    .filter(branchRoom => branchRoom.room_type?.id && branchRoom.room_type?.name)
    .map(branchRoom => branchRoom.room_type);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="hotelId" value={formData.hotelId} />
        <input type="hidden" name="branchId" value={formData.branchId} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-8">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded"
                required
              >
                <option value="">Select Room Type</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number *
              </label>
              <select
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded"
                required
                disabled={!formData.roomType}
              >
                <option value="">Select Room Number</option>
                {availableRoomNumbers.map((roomNumber) => (
                  <option key={roomNumber} value={roomNumber}>
                    {roomNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Floor *
              </label>
              <select
                name="roomFloor"
                value={formData.roomFloor}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded"
                required
                disabled={!formData.roomType}
              >
                <option value="">Select Floor</option>
                {availableFloors.map((floor) => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Price *
              </label>
              <input
                type="number"
                name="roomPrice"
                value={formData.roomPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded"
                placeholder="Enter room price"
                required
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Capacity *
              </label>
              <input
                type="number"
                name="roomCapacity"
                value={formData.roomCapacity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded"
                placeholder="Enter room capacity"
                required
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Bed className="w-5 h-5 mr-2 text-green-600" />
                Room Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(amenitiesMap).map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleChange}
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-gray-700 text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Bed className="w-5 h-5 mr-2 text-orange-600" />
                Add Room Summary
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-medium">
                    {roomTypes.find((t) => t.id === formData.roomType)?.name ??
                      "Not Selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Number:</span>
                  <span className="font-medium">
                    {formData.roomNumber || "Not Selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Floor:</span>
                  <span className="font-medium">
                    {formData.roomFloor ? `Floor ${formData.roomFloor}` : "Not Selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Price:</span>
                  <span className="font-medium">
                    {formData.roomPrice || "Not Selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Capacity:</span>
                  <span className="font-medium">
                    {formData.roomCapacity || "Not Selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Amenities:</span>
                  <span className="font-medium">
                    {formData.amenities.length > 0
                      ? formData.amenities.join(", ")
                      : "Not Selected"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Create Room
              </button>
              <button
                type="button"
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}