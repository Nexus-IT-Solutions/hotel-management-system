import { Search } from "lucide-react";
import CustomersTable from "../../components/admin-components/CustomersTable";

export default function Customer() {
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

      <CustomersTable/>

     
      {/* Customer Details Modal would go here */}
      <div className="bg-white rounded-lg shadow p-6 mt-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Customer Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Top Spending Customers
            </h4>
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
            <h4 className="font-medium text-gray-800 mb-2">
              Most Frequent Guests
            </h4>
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
