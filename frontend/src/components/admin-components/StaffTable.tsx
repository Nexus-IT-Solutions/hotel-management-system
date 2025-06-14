import { useEffect, useState } from 'react';
import { Edit, Trash2, User, Users } from 'lucide-react';
import axios from 'axios';

interface UserType {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'manager' | 'receptionist' | 'admin';
  is_active: boolean;
  last_login: string;
  // createdAt: string;
}

export default function StaffTable() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://hotel-management-system-5gk8.onrender.com/v1/users/branch/2092ff29-4786-11f0-a9cd-862ccfb04b4e',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.branchUsers || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role: UserType['role']) => {
    const styles: { [key: string]: string } = {
      manager: 'bg-purple-100 text-purple-800',
      receptionist: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[role]}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: boolean) => {
    const mappedStatus = status ? 'active' : 'suspended';
    const styles: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[mappedStatus]}`}>
        {mappedStatus}
      </span>
    );
  };

  if (loading) {
    return <div className="p-6 text-gray-500 text-sm">Loading staff...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">No staff found</p>
            <p className="text-sm text-gray-400">Please add staff members to see them listed here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.is_active)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.last_login}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.createdAt}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-900">
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
        )}
      </div>
    </div>
  );
}
