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

interface EditCustomerModal {
  isOpen: boolean;
  customer: customersSummary | null;
}

interface EditCustomerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
}


// Add the missing interface
interface DeleteCustomerModal {
  isOpen: boolean;
  customer: customersSummary | null;
}



export default function CustomersTable() {
  const [customers, setCustomers] = useState<customersSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<CustomerDetailsModal>({ isOpen: false, customer: null });
  const [editModal, setEditModal] = useState<EditCustomerModal>({ isOpen: false, customer: null });
  const [editForm, setEditForm] = useState<EditCustomerForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: ''
  });
  const [editLoading, setEditLoading] = useState<boolean>(false);

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


  // Add the missing state variable (add this with other useState declarations)
const [deleteModal, setDeleteModal] = useState<DeleteCustomerModal>({ isOpen: false, customer: null });
const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

// Add the missing handler functions
const handleDeleteCustomer = (customer: customersSummary) => {
  setDeleteModal({ isOpen: true, customer });
};

const closeDeleteModal = () => {
  setDeleteModal({ isOpen: false, customer: null });
};

const handleConfirmDelete = async () => {
  if (!deleteModal.customer) return;
  
  setDeleteLoading(true);
  try {
    // TODO: Replace with your API endpoint
    await axios.delete(
      `https://hotel-management-system-5gk8.onrender.com/v1/customers/${deleteModal.customer.id}`
    );
    
    // Remove the deleted customer from the customers list
    setCustomers(prev => 
      prev.filter(customer => customer.id !== deleteModal.customer!.id)
    );
    
    closeDeleteModal();
    // TODO: Add success notification here
    console.log('Customer deleted successfully');
  } catch (error) {
    console.error('Error deleting customer:', error);
    // TODO: Add error notification here
  } finally {
    setDeleteLoading(false);
  }
};

  const handleViewCustomer = (customer: customersSummary) => {
    setModal({ isOpen: true, customer });
  };

  const closeModal = () => {
    setModal({ isOpen: false, customer: null });
  };

  const handleEditCustomer = (customer: customersSummary) => {
    setEditForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      emergencyContact: customer.emergencyContact
    });
    setEditModal({ isOpen: true, customer });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, customer: null });
    setEditForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      emergencyContact: ''
    });
  };

  const handleFormChange = (field: keyof EditCustomerForm, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCustomer = async () => {
    if (!editModal.customer) return;
    
    setEditLoading(true);
    try {
      // TODO: Replace with your API endpoint
      const response = await axios.put(
        `https://hotel-management-system-5gk8.onrender.com/v1/customers/${editModal.customer.id}`,
        editForm
      );
      
      // Update the customers list with the edited customer
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === editModal.customer!.id 
            ? { ...customer, ...editForm }
            : customer
        )
      );
      
      closeEditModal();
      // TODO: Add success notification here
      console.log('Customer updated successfully');
    } catch (error) {
      console.error('Error updating customer:', error);
      // TODO: Add error notification here
    } finally {
      setEditLoading(false);
    }
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
                        className="text-blue-600 hover:text-blue-900 transition-colors cursor-pointer"
                        title="View customer details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditCustomer(customer)}
                        className="text-yellow-600 hover:text-yellow-900 cursor-pointer"
                        title="Edit customer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(customer)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Delete customer"
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
              <button 
                onClick={() => handleEditCustomer(customer)}
                className="text-yellow-600 hover:text-yellow-900 cursor-pointer"
                title="Edit customer"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteCustomer(customer)}
                className="text-red-600 hover:text-red-900"
                title="Delete customer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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

      {/* Edit Customer Modal */}
      {editModal.isOpen && editModal.customer && (
        <div className="fixed inset-0 bg-[#0000001A] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Customer</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer ID Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <p className="text-sm text-gray-500">Customer ID: <span className="font-mono">{editModal.customer.id}</span></p>
                <p className="text-sm text-gray-500">Total Bookings: <span className="font-medium">{editModal.customer.totalBookings}</span></p>
              </div>

              {/* Personal Information Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Personal Information
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer's full name"
                    required
                  />
                </div>
              </div>

              {/* Contact Information Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address Information
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Residential Address *
                  </label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter complete residential address"
                    required
                  />
                </div>
              </div>

              {/* Emergency Contact Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Emergency Contact
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Details
                  </label>
                  <input
                    type="text"
                    value={editForm.emergencyContact}
                    onChange={(e) => handleFormChange('emergencyContact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter emergency contact (Name and Phone)"
                  />
                </div>
              </div>

              {/* Form Validation Note */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Note:</span> Fields marked with * are required. 
                  Make sure all information is accurate before saving changes.
                </p>
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
                onClick={handleSaveCustomer}
                disabled={editLoading || !editForm.name || !editForm.email || !editForm.phone || !editForm.address}
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

      {/* Delete Customer Modal - Fixed Height Issue */}
      {deleteModal.isOpen && deleteModal.customer && (
        <div className="fixed inset-0 bg-[#0000001A] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">Delete Customer</h2>
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

            {/* Modal Content - Scrollable */}
            <div className="p-4 space-y-4">
              {/* Customer Information - Compact */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Customer to be deleted:</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium text-gray-900">{deleteModal.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono text-gray-900">{deleteModal.customer.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="text-gray-900">{deleteModal.customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bookings:</span>
                    <span className="font-medium text-gray-900">{deleteModal.customer.totalBookings}</span>
                  </div>
                </div>
              </div>

              {/* Warning Message - Compact */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-xs">
                    <h4 className="font-medium text-red-800 mb-1">Warning: Permanent Deletion</h4>
                    <ul className="text-red-700 space-y-0.5">
                      <li>• Permanently deletes customer record</li>
                      <li>• Removes all associated data</li>
                      {deleteModal.customer.totalBookings > 0 && (
                        <li>• Has {deleteModal.customer.totalBookings} booking record{deleteModal.customer.totalBookings !== 1 ? 's' : ''}</li>
                      )}
                      <li>• Cannot be reversed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirmation Text - Compact */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <span className="font-medium">Confirm:</span> Delete 
                  <span className="font-medium"> {deleteModal.customer.name}</span>? 
                  This removes all information permanently.
                </p>
              </div>
            </div>

            {/* Modal Footer - Sticky */}
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
