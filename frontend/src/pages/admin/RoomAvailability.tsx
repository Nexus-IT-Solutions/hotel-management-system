import { useState } from "react";
import { Calendar, Users, Settings, Search, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

const RoomAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const rooms = [
    {
      number: "101",
      type: "Standard",
      capacity: 2,
      status: "available",
      price: 120,
    },
    {
      number: "102",
      type: "Standard",
      capacity: 2,
      status: "occupied",
      guest: "John Doe",
      price: 120,
    },
    {
      number: "103",
      type: "Standard",
      capacity: 2,
      status: "maintenance",
      price: 120,
    },
    {
      number: "201",
      type: "Deluxe",
      capacity: 3,
      status: "available",
      price: 180,
    },
    {
      number: "202",
      type: "Deluxe",
      capacity: 3,
      status: "reserved",
      guest: "Alice Johnson",
      price: 180,
    },
    {
      number: "203",
      type: "Deluxe",
      capacity: 3,
      status: "available",
      price: 180,
    },
    {
      number: "301",
      type: "Suite",
      capacity: 4,
      status: "occupied",
      guest: "Bob Smith",
      price: 300,
    },
    {
      number: "302",
      type: "Suite",
      capacity: 4,
      status: "available",
      price: 300,
    },
    {
      number: "401",
      type: "Executive",
      capacity: 6,
      status: "available",
      price: 450,
    },
    {
      number: "402",
      type: "Executive",
      capacity: 6,
      status: "cleaning",
      price: 450,
    },
  ];

  const getStatusColor = (
    status: "available" | "occupied" | "reserved" | "maintenance" | "cleaning"
  ) => {
    const colors = {
      available: "bg-green-100 border-green-300 text-green-800",
      occupied: "bg-red-100 border-red-300 text-red-800",
      reserved: "bg-yellow-100 border-yellow-300 text-yellow-800",
      maintenance: "bg-gray-100 border-gray-300 text-gray-800",
      cleaning: "bg-blue-100 border-blue-300 text-blue-800",
    };
    return colors[status] || colors.available;
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "✓";
      case "occupied":
        return "👤";
      case "reserved":
        return "📅";
      case "maintenance":
        return "🔧";
      case "cleaning":
        return "🧹";
      default:
        return "?";
    }
  };

  const roomStats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    reserved: rooms.filter((r) => r.status === "reserved").length,
    outOfOrder: rooms.filter(
      (r) => r.status === "maintenance" || r.status === "cleaning"
    ).length,
  };

  // Modal component
  const RoomModal = ({ room, onClose }: { room: any; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#cfcfcf9c] bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-2">Room {room.number}</h2>
        <div className="mb-2 text-gray-700">{room.type}</div>
        <div className="mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1" /> Capacity: {room.capacity}
        </div>
        <div className="mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
              room.status
            )}`}
          >
            {room.status}
          </span>
        </div>
        {room.guest && (
          <div className="mb-2">
            <span className="font-medium">Guest:</span> {room.guest}
          </div>
        )}
        <div className="mb-2">
          <span className="font-medium">Price:</span> ${room.price}/night
        </div>
        {/* Add more details or actions here if needed */}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-between w-full space-x-4">
          <div className="flex flex-col md:flex-row lg:items-center gap-5">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 gap-5 bg-gray-100 rounded-lg p-1">
            <div>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded ${
                  viewMode === "grid" ? "bg-white shadow" : ""
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded ${
                  viewMode === "list" ? "bg-white shadow" : ""
                }`}
              >
                List
              </button>
            </div>

            <Link
              to="add-room"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-600 text-white px-3 py-2 rounded text-lg"
            >
              <Plus className="w-5 h-5 text-white" />
              Add Room
            </Link>
          </div>
        </div>
      </div>

      {/* Room Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-8 border-blue-500">
          <div className="text-2xl font-bold text-gray-800 ">
            {roomStats.total}
          </div>
          <div className="text-sm text-gray-600">Total Rooms</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-8 border-green-600">
          <div className="text-2xl font-bold text-green-600">
            {roomStats.available}
          </div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-8 border-red-500">
          <div className="text-2xl font-bold text-red-600">
            {roomStats.occupied}
          </div>
          <div className="text-sm text-gray-600">Occupied</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-8 border-yellow-600">
          <div className="text-2xl font-bold text-yellow-600">
            {roomStats.reserved}
          </div>
          <div className="text-sm text-gray-600">Reserved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-8 border-purple-500">
          <div className="text-2xl font-bold text-gray-600">
            {roomStats.outOfOrder}
          </div>
          <div className="text-sm text-gray-600">Out of Order</div>
        </div>
      </div>

      {/* Room Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {rooms.map((room) => (
            <div
              key={room.number}
              className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(
                room.status as
                  | "available"
                  | "occupied"
                  | "maintenance"
                  | "reserved"
                  | "cleaning"
              )}`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {getStatusIcon(room.status)}
                </div>
                <div className="font-bold text-lg">Room {room.number}</div>
                <div className="text-sm opacity-75">{room.type}</div>
                <div className="flex items-center justify-center mt-2 text-sm">
                  <Users className="w-3 h-3 mr-1" />
                  {room.capacity}
                </div>
                {room.guest && (
                  <div className="text-xs mt-1 truncate">{room.guest}</div>
                )}
                <div className="text-sm font-medium mt-1">
                  ${room.price}/night
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr
                  key={room.number}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedRoom(room)}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    Room {room.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {room.capacity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        room.status as
                          | "available"
                          | "occupied"
                          | "maintenance"
                          | "reserved"
                          | "cleaning"
                      )}`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {room.guest || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${room.price}/night
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoom(room);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* mobile list room */}
      <div className="block sm:hidden space-y-2">
        {rooms.map((room) => (
          <div
            key={room.number}
            className="border border-gray-200 rounded-lg p-4 cursor-pointer"
            onClick={() => setSelectedRoom(room)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {room.number}
                </h4>
                <p className="text-sm text-gray-600">
                  {room.type} • {room.capacity}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                  room.status as
                    | "available"
                    | "occupied"
                    | "maintenance"
                    | "reserved"
                    | "cleaning"
                )}`}
              >
                {room.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-800 mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Cleaning</span>
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <RoomModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
};

export default RoomAvailability;
