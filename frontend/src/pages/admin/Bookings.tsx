import { Search, Calendar, Edit, Trash2, Eye,Badge } from "lucide-react";
import { Link } from "react-router-dom";

export default function Bookings() {
  const getStatusBadge = (
    status: "Confirmed" | "Pending" | "Checked In" | "Checked Out" | "Cancelled"
  ) => {
    const styles = {
      Confirmed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      "Checked In": "bg-blue-100 text-blue-800",
      "Checked Out": "bg-gray-100 text-gray-800",
      Cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* welcome information */}
      <div className="md:px-6 px-2 py-4">
        <h1 className="text-2xl text-slate-800 font-bold tracking-wide">
          Bookings
        </h1>
        <p className="text-gray-500">
          Welcome back, manage your hotel efficiently
        </p>
      </div>
      {/* search section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-5 md:items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select className="px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/new-booking"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* bookings tables */}
      <div className="bg-white rounded-lg shadow hidden md:block">
        <div className="overflow-x-scroll w-full">
          <table className="w-full overflow-x-scroll">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customer}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Room {booking.room}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.roomType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {booking.checkIn}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {booking.checkOut}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.guests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(
                      booking.status as
                        | "Confirmed"
                        | "Pending"
                        | "Checked In"
                        | "Checked Out"
                        | "Cancelled"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${booking.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">4</span> of{" "}
              <span className="font-medium">{bookings.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile view */}
      <div className="block sm:hidden space-y-1">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {booking.customer}
                </h4>
                <p className="text-sm text-gray-600">
                  {booking.phone} • {booking.roomType}
                </p>
              </div>
              <Badge
                className={
                  booking.status === "Confirmed"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }
              >
                {booking.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Grade: {booking.room} • {booking.guests}
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-yellow-600 hover:text-yellow-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const bookings = [
  {
    id: "BK001",
    customer: "Alice Johnson",
    phone: "+1234567890",
    room: "201",
    roomType: "Deluxe",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    guests: 2,
    status: "Confirmed",
    total: 540,
  },
  {
    id: "BK002",
    customer: "Bob Smith",
    phone: "+1234567891",
    room: "305",
    roomType: "Suite",
    checkIn: "2024-01-16",
    checkOut: "2024-01-20",
    guests: 4,
    status: "Checked In",
    total: 1200,
  },
  {
    id: "BK003",
    customer: "Carol Davis",
    phone: "+1234567892",
    room: "120",
    roomType: "Standard",
    checkIn: "2024-01-17",
    checkOut: "2024-01-19",
    guests: 1,
    status: "Pending",
    total: 240,
  },
  {
    id: "BK004",
    customer: "David Wilson",
    phone: "+1234567893",
    room: "408",
    roomType: "Executive Suite",
    checkIn: "2024-01-18",
    checkOut: "2024-01-22",
    guests: 3,
    status: "Confirmed",
    total: 1800,
  },
  {
    id: "BK005",
    customer: "Alice Johnson",
    phone: "+1234567890",
    room: "201",
    roomType: "Deluxe",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    guests: 2,
    status: "Confirmed",
    total: 540,
  },
];
