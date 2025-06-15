import { useEffect, useState } from "react";
import { Edit, Trash2, Eye, Badge, Users, X, Calendar, Phone, MapPin, CreditCard, LoaderCircle, AlertCircle } from "lucide-react";
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
  total: number | string;
}

interface BookingDetailsModal {
  isOpen: boolean;
  booking: Booking | null;
}

interface EditBookingModal {
  isOpen: boolean;
  booking: Booking | null;
}

interface EditBookingForm {
  customer: string;
  phone: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "Confirmed" | "Pending" | "Checked In" | "Checked Out" | "Cancelled";
  total: number | string;
}

// Add the missing interface for delete modal
interface DeleteBookingModal {
  isOpen: boolean;
  booking: Booking | null;
}

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modal, setModal] = useState<BookingDetailsModal>({ isOpen: false, booking: null });
  const [editModal, setEditModal] = useState<EditBookingModal>({ isOpen: false, booking: null });
  const [editForm, setEditForm] = useState<EditBookingForm>({
    customer: '',
    phone: '',
    room: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    status: 'Pending',
    total: 0
  });
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<DeleteBookingModal>({ isOpen: false, booking: null });
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

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

  // ----------- FIXED: Edit Modal Logic -----------
  const handleEditBooking = (booking: Booking) => {
    // Format dates for input fields
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setEditForm({
      customer: booking.customer,
      phone: booking.phone,
      room: booking.room,
      roomType: booking.roomType,
      checkIn: formatDateForInput(booking.checkIn),
      checkOut: formatDateForInput(booking.checkOut),
      guests: booking.guests,
      status: booking.status,
      total: booking.total
    });
    setEditModal({ isOpen: true, booking });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, booking: null });
    setEditForm({
      customer: '',
      phone: '',
      room: '',
      roomType: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      status: 'Pending',
      total: 0
    });
  };

  const handleFormChange = (field: keyof EditBookingForm, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (!editModal.booking) return;
    setEditLoading(true);
    try {
      // TODO: Replace with your API endpoint
      await axios.put(
        `https://hotel-management-system-5gk8.onrender.com/v1/bookings/${editModal.booking.id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Update the bookings list with the edited booking
      setBookings(prev =>
        prev.map(booking =>
          booking.id === editModal.booking!.id
            ? { ...booking, ...editForm }
            : booking
        )
      );
      closeEditModal();
      // TODO: Add success notification here
      console.log('Booking updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
      // TODO: Add error notification here
    } finally {
      setEditLoading(false);
    }
  };
  // ----------- END FIXED -----------

  // Handler to open delete modal
  const handleDeleteBooking = (booking: Booking) => {
    setDeleteModal({ isOpen: true, booking });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, booking: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.booking) return;
    setDeleteLoading(true);
    try {
      // TODO: Replace with your API endpoint
      // await axios.delete(`https://hotel-management-system-5gk8.onrender.com/v1/bookings/${deleteModal.booking.id}`);
      // Remove the deleted booking from the bookings list
      setBookings(prev =>
        prev.filter(booking => booking.id !== deleteModal.booking!.id)
      );
      closeDeleteModal();
      // TODO: Add success notification here
      console.log('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      // TODO: Add error notification here
    } finally {
      setDeleteLoading(false);
    }
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
                        className="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
                        title="View booking details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditBooking(booking);
                        }}
                        className="text-yellow-600 hover:text-yellow-900 transition-colors cursor-pointer"
                        title="Edit booking"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBooking(booking)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                  className="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
                  title="View booking details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditBooking(booking)}
                  className="text-yellow-600 hover:text-yellow-900 cursor-pointer"
                  title="Edit booking"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteBooking(booking)}
                  className="text-red-600 hover:text-red-900 cursor-pointer"
                  title="Delete booking"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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

      {/* Edit Booking Modal */}
      {editModal.isOpen && editModal.booking && (
        <div className="fixed inset-0 bg-[#0000001A] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Booking</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Booking ID Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Booking Information</h4>
                <p className="text-sm text-gray-500">Booking ID: <span className="font-mono">{editModal.booking.id}</span></p>
              </div>

              {/* Customer Information Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Customer Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.customer}
                      onChange={(e) => handleFormChange('customer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Room Information Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Room Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      value={editForm.room}
                      onChange={(e) => handleFormChange('room', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter room number"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type *
                    </label>
                    <input
                      type="text"
                      value={editForm.roomType}
                      onChange={(e) => handleFormChange('roomType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter room type"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.guests}
                      onChange={(e) => handleFormChange('guests', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Stay Information Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Stay Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      value={editForm.checkIn}
                      onChange={(e) => handleFormChange('checkIn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      value={editForm.checkOut}
                      onChange={(e) => handleFormChange('checkOut', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Status and Total */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Booking Status & Payment
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => handleFormChange('status', e.target.value as EditBookingForm['status'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Checked Out">Checked Out</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.total}
                      onChange={(e) => handleFormChange('total', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter total amount"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeEditModal}
                disabled={editLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={editLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {editLoading ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Booking Modal */}
      {deleteModal.isOpen && deleteModal.booking && (
        <div className="fixed inset-0 bg-[#0000001A] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">Delete Booking</h2>
                  <p className="text-xs text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Booking Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Booking to be deleted:</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking ID:</span>
                    <span className="font-mono text-gray-900">{deleteModal.booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer:</span>
                    <span className="font-medium text-gray-900">{deleteModal.booking.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Room:</span>
                    <span className="text-gray-900">{deleteModal.booking.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium text-gray-900">{deleteModal.booking.status}</span>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-xs">
                    <h4 className="font-medium text-red-800 mb-1">Warning: Permanent Deletion</h4>
                    <ul className="text-red-700 space-y-0.5">
                      <li>• Permanently deletes booking record</li>
                      <li>• Removes all associated data</li>
                      <li>• Cannot be reversed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirmation Text */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <span className="font-medium">Confirm:</span> Delete 
                  <span className="font-medium"> Booking #{deleteModal.booking.id}</span>? 
                  This removes all information permanently.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-3 py-2 text-xs font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {deleteLoading ? (
                  <>
                    <LoaderCircle className="animate-spin w-3 h-3 mr-1" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
