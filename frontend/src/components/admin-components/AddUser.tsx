import { useState } from "react";
import { X } from "lucide-react";

interface AddUserProps {
  onClose: () => void;
}

export default function AddUser({ onClose }: AddUserProps) {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'receptionist',
    phone: '',
    password: '',
    username: '',
    is_active: '1' // string to be converted to number
  });

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get hotel_id and branch_id from localStorage
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      alert("User not logged in.");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    const payload = {
      ...newUser,
      is_active: parseInt(newUser.is_active),
      hotel_id: currentUser.hotel_id,
      branch_id: currentUser.branch_id,
    };

    try {
      const res = await fetch("https://hotel-management-system-5gk8.onrender.com/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to create user");
      }

      alert("User created successfully!");

      // Reset form and close modal
      setNewUser({
        name: '',
        email: '',
        role: 'receptionist',
        phone: '',
        password: '',
        username: '',
        is_active: '1'
      });

      onClose();

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h3>

      <form onSubmit={handleAddUser} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="receptionist">Receptionist</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Is Active</label>
          <select
            value={newUser.is_active}
            onChange={(e) => setNewUser({ ...newUser, is_active: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}
