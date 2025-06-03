import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", revenue: 12000, bookings: 45 },
  { month: "Feb", revenue: 15000, bookings: 52 },
  { month: "Mar", revenue: 18000, bookings: 61 },
  { month: "Apr", revenue: 22000, bookings: 73 },
  { month: "May", revenue: 25000, bookings: 84 },
  { month: "Jun", revenue: 28000, bookings: 91 },
]

export function RevenueChart() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className=" rounded-t-md flex items-center justify-between border-b    ">
        <CardTitle className="text-xl font-semibold text-gray-900">Revenue Overview</CardTitle>
        <div>
          <select name="" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4">
            <option value="1 Year">1 Year</option>
            <option value="2 Year">6 Months</option>
            <option value="3 Year">3 Months</option>
            <option value="4 Year">1 Month</option>
            <option value="5 Year">1 Week</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />.  
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
