
import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import {
  CalendarCheck,
  BedDouble,
  DollarSign,
  LogIn,
} from "lucide-react";

interface DashboardStat {
  title: string;
  value: string;
  change: string;
  description: string;
}

interface ApiResponse {
  status: string;
  data: DashboardStat[];
  message: string;
}

const iconMap: Record<string, JSX.Element> = {
  "Today's Bookings": (
    <div className="bg-blue-100 p-2 rounded-sm">
      <CalendarCheck className="w-5 h-5 text-blue-600" />
    </div>
  ),
  "Available Rooms": (
    <div className="bg-green-100 p-2 rounded-sm">
      <BedDouble className="w-5 h-5 text-green-600" />
    </div>
  ),
  "Today's Revenue": (
    <div className="bg-yellow-100 p-2 rounded-sm">
      <DollarSign className="w-5 h-5 text-yellow-500" />
    </div>
  ),
  "Today's Check-ins": (
    <div className="bg-purple-100 p-2 rounded-sm">
      <LogIn className="w-5 h-5 text-purple-600" />
    </div>
  ),
};

const borderColorMap: Record<string, string> = {
  "Today's Bookings": "border-t-4 border-blue-600",
  "Available Rooms": "border-t-4 border-green-600",
  "Today's Revenue": "border-t-4 border-yellow-500",
  "Today's Check-ins": "border-t-4 border-purple-600",
};

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          "https://hotel-management-system-5gk8.onrender.com/v1/dashboard/stats"
        );
        setStats(res.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard stats");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-gray-500 p-4">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white shadow-md rounded-md px-5 py-2 border-t border-blue-500 hover:shadow-lg transition ${borderColorMap[stat.title] || ""}`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              {iconMap[stat.title] || <CalendarCheck className="w-6 h-6 text-gray-400" />}
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            <p
              className={`text-sm font-semibold ${
                stat.change.includes("-") ? "text-red-500" : "text-green-500"
              }`}
            >
              {stat.change}
            </p>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
