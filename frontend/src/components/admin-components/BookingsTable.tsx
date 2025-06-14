import { useEffect, useState } from "react";
import { Edit, Trash2, Eye, Badge, Users, X, Calendar, Phone, MapPin, CreditCard } from "lucide-react";
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
  total: number | string; // Allow both number and string
}

interface BookingDetailsModal {
  isOpen: boolean;
  booking: Booking | null;
}

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modal, setModal] = useState<BookingDetailsModal>({ isOpen: false, booking: null });

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

  const handleViewBooking = (booking: Booking) => {
    setModal({ isOpen: true, booking });
  };

  const closeModal = () => {
    setModal({ isOpen: false, booking: null });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to safely format currency
  const formatCurrency = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined) {
      return "$0.00";
    }
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount)) {
      return "$0.00";
    }
    
    return `$${numericAmount.toFixed(2)}`;
  };

  // Helper function to get numeric value
  const getNumericValue = (amount: number | string | null | undefined): number => {
    if (amount === null || amount === undefined) {
      return 0;
    }
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    return isNaN(numericAmount) ? 0 : numericAmount;
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(booking.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleViewBooking(booking)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View booking details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
                <button 
                  onClick={() => handleViewBooking(booking)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                  title="View booking details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-yellow-600 hover:text-yellow-900"><Edit className="w-4 h-4" /></button>
                <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      {modal.isOpen && modal.booking && (
        <div className="fixed inset-0 bg-[#0000001A] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Booking ID and Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Booking #{modal.booking.id}</h3>
                  <p className="text-sm text-gray-500">Booking Reference</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(modal.booking.status.toLowerCase() as "confirmed" | "pending" | "checked_in" | "checked_out" | "cancelled")}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{modal.booking.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      Phone Number
                    </p>
                    <p className="font-medium text-gray-900">{modal.booking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Room Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Room Number</p>
                    <p className="font-medium text-gray-900">Room {modal.booking.room}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Type</p>
                    <p className="font-medium text-gray-900">{modal.booking.roomType}</p>
                  </div>
                                    <div>
                    <p className="text-sm text-gray-500">Number of Guests</p>
                    <p className="font-medium text-gray-900">{modal.booking.guests} {modal.booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                  </div>
                </div>
              </div>

              {/* Stay Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Stay Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check-in Date</p>
                    <p className="font-medium text-gray-900">{formatDate(modal.booking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out Date</p>
                    <p className="font-medium text-gray-900">{formatDate(modal.booking.checkOut)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {Math.ceil((new Date(modal.booking.checkOut).getTime() - new Date(modal.booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium text-gray-900 text-lg">{formatCurrency(modal.booking.total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className="font-medium text-gray-900">
                      {modal.booking.status === "Confirmed" || modal.booking.status === "Checked In" || modal.booking.status === "Checked Out" 
                        ? "Paid" 
                        : modal.booking.status === "Pending" 
                        ? "Pending Payment" 
                        : "Cancelled"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">{modal.booking.customer}</span> has booked <span className="font-medium">Room {modal.booking.room}</span> ({modal.booking.roomType})</p>
                  <p>for <span className="font-medium">{modal.booking.guests} {modal.booking.guests === 1 ? 'guest' : 'guests'}</span> from <span className="font-medium">{new Date(modal.booking.checkIn).toLocaleDateString()}</span> to <span className="font-medium">{new Date(modal.booking.checkOut).toLocaleDateString()}</span></p>
                  <p>Total cost: <span className="font-medium text-green-600">{formatCurrency(modal.booking.total)}</span></p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Close
              </button>
              {/* <button className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors">
                <Edit className="w-4 h-4 inline mr-1" />
                Edit Booking
              </button> */}
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Print Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

