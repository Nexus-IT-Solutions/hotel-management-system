"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Mail, Phone, LoaderCircle, X, User, MapPin, Users, AlertCircle } from "lucide-react";

interface customersSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  totalBookings: number;
}

interface CustomerDetailsModal {
  isOpen: boolean;
  customer: customersSummary | null;
}

export default function CustomersTable() {
  const [customers, setCustomers] = useState<customersSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<CustomerDetailsModal>({ isOpen: false, customer: null });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://hotel-management-system-5gk8.onrender.com/v1/customers/summary"
        );
        setCustomers(response.data.customersSummary || []);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewCustomer = (customer: customersSummary) => {
    setModal({ isOpen: true, customer });
  };

  const closeModal = () => {
    setModal({ isOpen: false, customer: null });
  };

  const getBookingStatusText = (totalBookings: number) => {
    if (totalBookings === 0) return "New Customer";
    if (totalBookings === 1) return "First-time Guest";
    if (totalBookings <= 5) return "Regular Guest";
    return "VIP Guest";
  };

  const getBookingStatusColor = (totalBookings: number) => {
    if (totalBookings === 0) return "bg-gray-100 text-gray-800";
    if (totalBookings === 1) return "bg-blue-100 text-blue-800";
    if (totalBookings <= 5) return "bg-green-100 text-green-800";
    return "bg-purple-100 text-purple-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 space-x-2 text-gray-600">
        <LoaderCircle className="animate-spin h-6 w-6" />
        <span>Loading customers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 bg-red-100 border border-red-300 rounded p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emergency Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <Phone className="w-3 h-3 mr-1" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-3 h-3 mr-1" />
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.emergencyContact}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.totalBookings}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleViewCustomer(customer)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View customer details"
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
      </div>

      {/* Mobile View */}
      <div className="block md:hidden space-y-2 mt-4">
        {customers.map((customer) => (
          <div key={customer.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="mb-2">
              <h4 className="font-medium text-gray-900">{customer.name}</h4>
              <p className="text-sm text-gray-600">{customer.phone} • {customer.address}</p>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Bookings: {customer.totalBookings} • Emergency: {customer.emergencyContact}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleViewCustomer(customer)}
                className="text-blue-600 hover:text-blue-900 transition-colors"
                title="View customer details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button className="text-yellow-600 hover:text-yellow-900"><Edit className="w-4 h-4" /></button>
              <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Details Modal */}
      {modal.isOpen && modal.customer && (
        <div className="fixed inset-0 bg-[#0000001A] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer ID and Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{modal.customer.name}</h3>
                  <p className="text-sm text-gray-500">Customer ID: {modal.customer.id}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(modal.customer.totalBookings)}`}>
                    {getBookingStatusText(modal.customer.totalBookings)}
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{modal.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer ID</p>
                    <p className="font-medium text-gray-900 font-mono text-xs">{modal.customer.id}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      Phone Number
                    </p>
                    <p className="font-medium text-gray-900">{modal.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      Email Address
                    </p>
                    <p className="font-medium text-gray-900">{modal.customer.email}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address Information
                </h4>
                <div>
                  <p className="text-sm text-gray-500">Residential Address</p>
                  <p className="font-medium text-gray-900">{modal.customer.address}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Emergency Contact
                </h4>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact Details</p>
                  <p className="font-medium text-gray-900">{modal.customer.emergencyContact}</p>
                </div>
              </div>

              {/* Booking Statistics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Booking Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="font-medium text-gray-900 text-2xl">{modal.customer.totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer Status</p>
                    <p className="font-medium text-gray-900">{getBookingStatusText(modal.customer.totalBookings)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Customer Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">{modal.customer.name}</span> is a <span className="font-medium">{getBookingStatusText(modal.customer.totalBookings).toLowerCase()}</span> with <span className="font-medium">{modal.customer.totalBookings}</span> total booking{modal.customer.totalBookings !== 1 ? 's' : ''}.</p>
                  <p>Contact: <span className="font-medium">{modal.customer.phone}</span> • Email: <span className="font-medium">{modal.customer.email}</span></p>
                  <p>Address: <span className="font-medium">{modal.customer.address}</span></p>
                  {modal.customer.emergencyContact && (
                    <p>Emergency Contact: <span className="font-medium">{modal.customer.emergencyContact}</span></p>
                  )}
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
                Edit Customer
              </button> */}
              <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                View Bookings
              </button>
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
