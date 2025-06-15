import { Bed, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddRoomForms() {
  const [roomTypes, setRoomTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState({
    roomNumber: 0,
    roomType: "",
    roomFloor: 0,
    roomPrice: 0,
    roomCapacity: 0,
    amenities: [] as string[],
    hotelId: 0,
    branchId: 0,
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

    axios
      .get(
        `https://hotel-management-system-5gk8.onrender.com/v1/room-types/branch/${formData.branchId}`
      )
      .then((res) => setRoomTypes(res.data.roomTypes || []))
      .catch((err) => console.error("Failed to fetch room types", err));
  }, [formData.branchId]);

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
        [name]:
          type === "number" || name.includes("room") ? Number(value) : value,
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
      room_type_id: parseInt(formData.roomType),
      floor: formData.roomFloor,
      status: "available",
      hotel_id: formData.hotelId,
      branch_id: formData.branchId,
      price: formData.roomPrice,
      capacity: formData.roomCapacity,
      amenities: formattedAmenities,
    };

    try {
      const res = await axios.post(
        "http://hotel-management-system-5gk8.onrender.com/v1/rooms",
        payload
      );
      alert(res.data.message || "Room created successfully!");
      setFormData((prev) => ({
        ...prev,
        roomNumber: 0,
        roomType: "",
        roomFloor: 0,
        roomPrice: 0,
        roomCapacity: 0,
        amenities: [],
      }));
    } catch (err: any) {
      console.error("Room creation failed:", err);
      alert(err?.response?.data?.message || "Room creation failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="hotelId" value={formData.hotelId} />
        <input type="hidden" name="branchId" value={formData.branchId} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-8">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number *
              </label>
              <input
                type="number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded"
                placeholder="Enter room number"
                required
              />
            </div>
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
                Room Floor *
              </label>
              <select
                name="roomFloor"
                value={formData.roomFloor}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded"
                required
              >
                <option value={0}>Ground Floor</option>
                <option value={1}>Floor 1</option>
                <option value={2}>Floor 2</option>
                <option value={3}>Floor 3</option>
                <option value={4}>Last Floor</option>
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
                  <span className="text-gray-600">Room Number:</span>
                  <span className="font-medium">
                    {formData.roomNumber || "Not Selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-medium">
                    {roomTypes.find((t) => t.id === parseInt(formData.roomType))?.name ??
                      "Not Selected"}
                  </span>{" "}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Floor:</span>
                  <span className="font-medium">
                    {formData.roomFloor || "Not Selected"}
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