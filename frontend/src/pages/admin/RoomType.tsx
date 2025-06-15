import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddRoom() {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const hotel_id = user?.user?.hotel_id;
  const branch_id = user?.user?.branch_id;

  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [form, setForm] = useState({
    room_number: "",
    floor: "",
    status: "available",
    room_type_id: "",
    amenities: {
      tv: false,
      wifi: false,
      minibar: false,
      breakfast_included: false,
      jacuzzi: false,
    },
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (name in form.amenities) {
      setForm((prev) => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [name]: checked,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get(
        `https://hotel-management-system-5gk8.onrender.com/v1/room-types/branch/${branch_id}`
      );
      setRoomTypes(res.data.data);
    } catch (err) {
      console.error("Error fetching room types:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      hotel_id,
      branch_id,
      amenities: JSON.stringify(form.amenities),
    };

    try {
      await axios.post(
        "https://hotel-management-system-5gk8.onrender.com/v1/rooms",
        payload
      );
      setMessage("Room added successfully!");
      setForm({
        room_number: "",
        floor: "",
        status: "available",
        room_type_id: "",
        amenities: {
          tv: false,
          wifi: false,
          minibar: false,
          breakfast_included: false,
          jacuzzi: false,
        },
      });
    } catch (err) {
      console.error("Error adding room:", err);
      setMessage("Failed to add room.");
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-6">Add New Room</h2>
      {message && <div className="mb-4 text-green-600 font-medium">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="room_number"
            value={form.room_number}
            onChange={handleChange}
            placeholder="Room Number"
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            placeholder="Floor"
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <select
          name="room_type_id"
          value={form.room_type_id}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          required
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="tv"
              checked={form.amenities.tv}
              onChange={handleChange}
            />
            TV
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="wifi"
              checked={form.amenities.wifi}
              onChange={handleChange}
            />
            WiFi
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="minibar"
              checked={form.amenities.minibar}
              onChange={handleChange}
            />
            Minibar
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="breakfast_included"
              checked={form.amenities.breakfast_included}
              onChange={handleChange}
            />
            Breakfast Included
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="jacuzzi"
              checked={form.amenities.jacuzzi}
              onChange={handleChange}
            />
            Jacuzzi
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Room
        </button>
      </form>Add commentMore actions
    </div>
  );
}