import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function RoomType() {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_per_night: "",
    max_occupancy: "",
    amenities: {
      tv: false,
      wifi: false,
      minibar: false,
      breakfast_included: false,
      jacuzzi: false,
    },
  });
  const [editId, setEditId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const hotel_id = user?.user?.hotel_id;
  const branch_id = user?.user?.branch_id;

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get(
        `https://hotel-management-system-5gk8.onrender.com/v1/room-types/branch/${branch_id}`
      );
      const formatted = res.data.data.map((item: any) => ({
        ...item,
        amenities: JSON.parse(item.amenities || "{}"),
      }));
      setRoomTypes(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, checked } = e.target;
    if (name in form.amenities) {
      setForm({
        ...form,
        amenities: { ...form.amenities, [name]: checked },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        hotel_id,
        branch_id,
        amenities: JSON.stringify(form.amenities),
      };
      if (editId) {
        await axios.put(
          `https://hotel-management-system-5gk8.onrender.com/v1/room-types/${editId}`,
          payload
        );
      } else {
        await axios.post(
          "https://hotel-management-system-5gk8.onrender.com/v1/room-types",
          payload
        );
      }
      fetchRoomTypes();
      setForm({
        name: "",
        description: "",
        price_per_night: "",
        max_occupancy: "",
        amenities: {
          tv: false,
          wifi: false,
          minibar: false,
          breakfast_included: false,
          jacuzzi: false,
        },
      });
      setEditId(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (room: any) => {
    const amenities =
      typeof room.amenities === "string"
        ? JSON.parse(room.amenities)
        : room.amenities;

    setForm({
      name: room.name || "",
      description: room.description || "",
      price_per_night: room.price_per_night || "",
      max_occupancy: room.max_occupancy || "",
      amenities: {
        tv: amenities.tv || false,
        wifi: amenities.wifi || false,
        minibar: amenities.minibar || false,
        breakfast_included: amenities.breakfast_included || false,
        jacuzzi: amenities.jacuzzi || false,
      },
    });

    setEditId(room.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://hotel-management-system-5gk8.onrender.com/v1/room-types/${id}`
        );
        Swal.fire("Deleted!", "Room type has been deleted.", "success");
        fetchRoomTypes();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete room type.", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Room Types Management</h1>
          <p className="text-blue-100">Manage and track room types</p>
        </div>
        <button
          className="flex items-center gap-2 bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5" /> Add Room Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roomTypes.map((room, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden relative group border hover:shadow-2xl transition-all"
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">
                  {room.name}
                </h2>
                <div className="flex gap-2">
                  <Pencil
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                    onClick={() => handleEdit(room)}
                  />
                  <Trash2
                    className="w-5 h-5 text-red-600 cursor-pointer"
                    onClick={() => handleDelete(room.id)}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-1">{room.description}</p>
              <p className="mt-2 text-blue-600 font-semibold">
                ${room.price_per_night} / night
              </p>
              <p className="text-sm text-gray-500">
                Max occupancy: {room.max_occupancy}
              </p>

              <div className="text-sm text-slate-600 mt-2">
                Amenities:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {(() => {
                    try {
                      // If amenities is a string (not parsed yet)
                      const amenities =
                        typeof room.amenities === "string"
                          ? JSON.parse(room.amenities)
                          : room.amenities;

                      // If it's an object (correct format)
                      if (
                        amenities &&
                        typeof amenities === "object" &&
                        !Array.isArray(amenities)
                      ) {
                        return Object.entries(amenities)
                          .filter(([_, value]) => value)
                          .map(([key], index) => (
                            <li key={index} className="capitalize">
                              {key.replace(/_/g, " ")}
                            </li>
                          ));
                      }

                      // If it's an array
                      if (Array.isArray(amenities)) {
                        return amenities.map((item, index) => (
                          <li key={index} className="capitalize">
                            {String(item)}
                          </li>
                        ));
                      }

                      return (
                        <li className="text-gray-400 italic">No amenities</li>
                      );
                    } catch (error) {
                      console.error("Amenity parsing error:", error);
                      return (
                        <li className="text-red-500 italic">
                          Invalid amenities
                        </li>
                      );
                    }
                  })()}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 space-y-4"
          >
            <h2 className="text-lg font-bold">
              {editId ? "Edit Room Type" : "Add New Room Type"}
            </h2>

            <input type="hidden" name="hotel_id" value={hotel_id} />
            <input type="hidden" name="branch_id" value={branch_id} />

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Room name"
              className="w-full border px-3 py-2 rounded"
              required
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="price_per_night"
                value={form.price_per_night}
                onChange={handleChange}
                placeholder="Price per night"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                name="max_occupancy"
                value={form.max_occupancy}
                onChange={handleChange}
                placeholder="Max occupancy"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div className="space-y-2">
              <p className="font-medium">Amenities:</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(form.amenities).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm capitalize"
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={(form.amenities as any)[key]}
                      onChange={handleChange}
                    />
                    {key.replace(/_/g, " ")}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}