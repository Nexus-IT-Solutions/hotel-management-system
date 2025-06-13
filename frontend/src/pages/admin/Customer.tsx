import { Search, Eye, Edit, Trash2, Mail, Phone } from "lucide-react";
import Swal from "sweetalert2";

export default function Customer() {

  const handleDelete = () => {
      Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#B3B3B3",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your record has been deleted.",
        icon: "success"
      });
    }
  });
    }

  return (
    <div>
      {/* header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        {/* customers information */}
        <div className="py-4">
          <h1 className="text-2xl text-slate-800 font-bold tracking-wide">
            Bookings
          </h1>
          <p className="text-gray-500">
            Welcome back, manage your hotel efficiently
          </p>
        </div>

        {/* search and store by section */}
        <div className="flex flex-col md:flex-row md:items-center gap-5 space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="name">Sort by Name</option>
            <option value="bookings">Sort by Bookings</option>
            <option value="spent">Sort by Total Spent</option>
            <option value="lastVisit">Sort by Last Visit</option>
          </select>
        </div>
      </div>

      {/* customer Statistic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-5">
        <div className="bg-white p-6 rounded-lg shadow border-l-8 border-green-500">
          <div className="text-2xl font-bold text-gray-800">247</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-8 border-blue-500">
          <div className="text-2xl font-bold text-purple-600">18</div>
          <div className="text-sm text-gray-600">VIP Customers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-8 border-purple-500">
          <div className="text-2xl font-bold text-blue-600">45</div>
          <div className="text-sm text-gray-600">Premium Members</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-8 border-orange-500">
          <div className="text-2xl font-bold text-green-600">$2,340</div>
          <div className="text-sm text-gray-600">Avg Customer Value</div>
        </div>
      </div>

      {/* customer table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emergence Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">{customer.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900 font-medium">
                        <Mail className="w-3 h-3 mr-1" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-3 h-3 mr-1" />
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.emergencyContact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalBookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-yellow-900">
                        <Trash2 className="w-4 h-4" onClick={handleDelete} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal would go here */}
      <div className="bg-white rounded-lg shadow p-6 mt-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Top Spending Customers</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>David Wilson</span>
                <span className="font-medium">$9,750</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bob Smith</span>
                <span className="font-medium">$7,200</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Alice Johnson</span>
                <span className="font-medium">$4,320</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Most Frequent Guests</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>David Wilson</span>
                <span className="font-medium">15 stays</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bob Smith</span>
                <span className="font-medium">12 stays</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Alice Johnson</span>
                <span className="font-medium">8 stays</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Customer Growth</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className="font-medium text-green-600">+12 new</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Month</span>
                <span className="font-medium">+8 new</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Growth Rate</span>
                <span className="font-medium text-green-600">+50%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const customers = [
  {
    id: "CUST001",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    emergencyContact: "0201434567",
    totalBookings: 8,
  },
  {
    id: "CUST002",
    name: "Bob Smith",
    email: "bob.smith@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Elm St, Anytown, USA",
    emergencyContact: "0201434568",
    totalBookings: 12,
  },
  {
    id: "CUST003",
    name: "Carol Davis",
    email: "carol.davis@email.com",
    phone: "+1 (555) 345-6789",
    address: "789 Oak St, Anytown, USA",
    emergencyContact: "0201434569",
    totalBookings: 8,
  },
  {
    id: "CUST004",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 456-7890",
    address: "321 Pine St, Anytown, USA",
    emergencyContact: "0201434570",
    totalBookings: 15,
  },
];
