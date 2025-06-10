import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, TrendingUp, Download } from 'lucide-react';


export default function Reports (){

  const [dateRange, setDateRange] = useState('7days');

  const revenueData = [
    { date: '2024-01-10', revenue: 1200, bookings: 8 },
    { date: '2024-01-11', revenue: 1800, bookings: 12 },
    { date: '2024-01-12', revenue: 2200, bookings: 15 },
    { date: '2024-01-13', revenue: 1600, bookings: 10 },
    { date: '2024-01-14', revenue: 2800, bookings: 18 },
    { date: '2024-01-15', revenue: 3200, bookings: 22 },
    { date: '2024-01-16', revenue: 2400, bookings: 16 }
  ];

  const occupancyData = [
    { month: 'Jan', occupancy: 85 },
    { month: 'Feb', occupancy: 92 },
    { month: 'Mar', occupancy: 78 },
    { month: 'Apr', occupancy: 88 },
    { month: 'May', occupancy: 95 },
    { month: 'Jun', occupancy: 89 }
  ];

  const roomTypeData = [
    { name: 'Standard', value: 35, color: '#8884d8' },
    { name: 'Deluxe', value: 28, color: '#82ca9d' },
    { name: 'Suite', value: 22, color: '#ffc658' },
    { name: 'Executive', value: 15, color: '#ff7300' }
  ];

  const paymentMethodData = [
    { method: 'Credit Card', amount: 45000, percentage: 60 },
    { method: 'Cash', amount: 22500, percentage: 30 },
    { method: 'Mobile Money', amount: 5625, percentage: 7.5 },
    { method: 'Bank Transfer', amount: 1875, percentage: 2.5 }
  ];


  return(
    <div className="space-y-6">
    {/* Header Controls */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Download className="w-4 h-4" />
        <span>Export Report</span>
      </button>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">$15,200</p>
            <p className="text-green-600 text-sm">+12% from last period</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Average Occupancy</p>
            <p className="text-2xl font-bold text-gray-800">87%</p>
            <p className="text-green-600 text-sm">+5% from last period</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-800">101</p>
            <p className="text-green-600 text-sm">+8% from last period</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Average Daily Rate</p>
            <p className="text-2xl font-bold text-gray-800">$150</p>
            <p className="text-green-600 text-sm">+3% from last period</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Revenue & Bookings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
            <Bar yAxisId="right" dataKey="bookings" fill="#10B981" name="Bookings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Occupancy Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Occupancy Rate Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="occupancy" stroke="#8B5CF6" strokeWidth={3} name="Occupancy %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Room Type Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Type Bookings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={roomTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {roomTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {paymentMethodData.map((payment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                <span className="text-gray-700">{payment.method}</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-800">${payment.amount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{payment.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Performance Table */}
    {/* <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Top Performing Rooms</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium">Room 301</td>
              <td className="px-6 py-4 whitespace-nowrap">Suite</td>
              <td className="px-6 py-4 whitespace-nowrap">28</td>
              <td className="px-6 py-4 whitespace-nowrap">$8,400</td>
              <td className="px-6 py-4 whitespace-nowrap">95%</td>
              <td className="px-6 py-4 whitespace-nowrap">4.8</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium">Room 201</td>
              <td className="px-6 py-4 whitespace-nowrap">Deluxe</td>
              <td className="px-6 py-4 whitespace-nowrap">32</td>
              <td className="px-6 py-4 whitespace-nowrap">$5,760</td>
              <td className="px-6 py-4 whitespace-nowrap">92%</td>
              <td className="px-6 py-4 whitespace-nowrap">4.7</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium">Room 401</td>
              <td className="px-6 py-4 whitespace-nowrap">Executive</td>
              <td className="px-6 py-4 whitespace-nowrap">18</td>
              <td className="px-6 py-4 whitespace-nowrap">$8,100</td>
              <td className="px-6 py-4 whitespace-nowrap">88%</td>
              <td className="px-6 py-4 whitespace-nowrap">4.9</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> */}
  </div>
  )
}