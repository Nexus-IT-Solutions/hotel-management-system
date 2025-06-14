import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { X } from "lucide-react";

export default function CreateUserPopup({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem("userData");
    if (!stored) {
      Swal.fire("Error", "User not logged in. Please log in first.", "error");
      return;
    }

    const { user } = JSON.parse(stored);
    const { hotel_id, branch_id } = user;

    if (!hotel_id || !branch_id) {
      Swal.fire("Error", "Missing hotel or branch ID. Please log in again.", "error");
      return;
    }

    const payload = { ...formData, hotel_id, branch_id };

    try {
      const response = await axios.post(
        "https://hotel-management-system-5gk8.onrender.com/v1/users",
        payload
      );

      if (response.status === 201 || response.data.status === "success") {
        Swal.fire("Success", "User created successfully!", "success");
        setFormData({
          name: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          role: "",
          is_active: true,
        });
        onClose(); // close the modal
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create user",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg relative px-6 py-8 mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-sm"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-sm"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-sm"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-sm"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-sm"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-sm"
          >
            <option value="">Select Role</option>
            <option value="manager">Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="ceo">CEO</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Active
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 text-sm"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
