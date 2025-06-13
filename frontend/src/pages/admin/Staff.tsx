import  { useState } from 'react';
import { Plus , Shield, User, Settings } from 'lucide-react';
import StaffTable from '../../components/admin-components/StaffTable';

export default function Staff(){


  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'receptionist',
    phone: '',
    password: ''
  });

  // const users = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     email: 'john.doe@hotelflow.com',
  //     phone: '+1 (555) 123-4567',
  //     role: 'manager',
  //     status: 'active',
  //     lastLogin: '2024-01-20 09:30:00',
  //     createdAt: '2023-06-15'
  //   },
  //   {
  //     id: 2,
  //     name: 'Sarah Johnson',
  //     email: 'sarah.j@hotelflow.com',
  //     phone: '+1 (555) 234-5678',
  //     role: 'receptionist',
  //     status: 'active',
  //     lastLogin: '2024-01-20 14:22:00',
  //     createdAt: '2023-08-22'
  //   },
  //   {
  //     id: 3,
  //     name: 'Mike Brown',
  //     email: 'mike.brown@hotelflow.com',
  //     phone: '+1 (555) 345-6789',
  //     role: 'receptionist',
  //     status: 'inactive',
  //     lastLogin: '2024-01-18 16:45:00',
  //     createdAt: '2023-09-10'
  //   },
  //   {
  //     id: 4,
  //     name: 'Emily Davis',
  //     email: 'emily.d@hotelflow.com',
  //     phone: '+1 (555) 456-7890',
  //     role: 'manager',
  //     status: 'active',
  //     lastLogin: '2024-01-20 11:15:00',
  //     createdAt: '2023-05-30'
  //   }
  // ];

  

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle user creation
    console.log('Creating user:', newUser);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', role: 'receptionist', phone: '', password: '' });
  };

  const permissions = {
    manager: [
      'View all bookings',
      'Create/edit bookings',
      'Manage customers',
      'View reports',
      'Manage users',
      'Hotel settings',
      'Financial data'
    ],
    receptionist: [
      'View bookings',
      'Create/edit bookings',
      'Room availability',
      'Customer check-in/out',
      'Basic customer info'
    ]
  };


  return(
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">4</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-b-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Managers</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Receptionists</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-b-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

     {/* user's table */}
     <StaffTable/>

      {/* Role Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Manager Permissions</h3>
          <div className="space-y-2">
            {permissions.manager.map((permission, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm text-gray-700">{permission}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Receptionist Permissions</h3>
          <div className="space-y-2">
            {permissions.receptionist.map((permission, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-700">{permission}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h3>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}