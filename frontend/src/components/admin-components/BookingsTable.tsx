import { useEffect, useState } from "react";
import { Edit, Trash2, Eye, Badge, Users } from "lucide-react";
import axios from "axios";

interface Booking {
  id: string;
  customer: string;
  phone: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "Confirmed" | "Pending" | "Checked In" | "Checked Out" | "Cancelled";
  total: number;
}

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://hotel-management-system-5gk8.onrender.com/v1/bookings/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (
    status: "confirmed" | "pending" | "checked_in" | "checked_out" | "cancelled"
  ) => {
    const styles: Record<"booked" | "pending" | "checked_in" | "checked_out" | "cancelled", string> = {
      booked: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      checked_in: "bg-blue-100 text-blue-800",
      checked_out: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="p-6 text-gray-500 text-sm text-center">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        <Users className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium">No bookings found</p>
        <p className="text-sm text-gray-400">Please add bookings to see them listed here.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="bg-white rounded-lg shadow hidden md:block">
        <div className="overflow-x-scroll w-full">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div>{booking.customer}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Room {booking.room}</div>
                      <div className="text-sm text-gray-500">{booking.roomType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.checkIn}</div>
                    <div className="text-sm text-gray-500">to {booking.checkOut}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.guests}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status.toLowerCase() as "confirmed" | "pending" | "checked_in" | "checked_out" | "cancelled")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${booking.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button>
                      <button className="text-yellow-600 hover:text-yellow-900"><Edit className="w-4 h-4" /></button>
                      <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{bookings.length}</span> of <span className="font-medium">{bookings.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-1">
        {bookings.map((booking) => (
          <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{booking.customer}</h4>
                <p className="text-sm text-gray-600">{booking.phone} • {booking.roomType}</p>
              </div>
              <Badge className={
                booking.status === "Confirmed"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }>
                {booking.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Room: {booking.room} • Guests: {booking.guests}
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button>
                <button className="text-yellow-600 hover:text-yellow-900"><Edit className="w-4 h-4" /></button>
                <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
