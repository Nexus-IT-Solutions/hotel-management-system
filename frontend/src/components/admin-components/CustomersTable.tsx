"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Mail, Phone, LoaderCircle } from "lucide-react";

interface customersSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  totalBookings: number;
}

export default function CustomersTable() {
  const [customers, setCustomers] = useState<customersSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
              <button className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button>
              <button className="text-yellow-600 hover:text-yellow-900"><Edit className="w-4 h-4" /></button>
              <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
