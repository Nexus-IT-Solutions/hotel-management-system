import {
  CalendarCheck2,
  ArrowUp,
  Plus,
  Minus,
  CalendarMinus2Icon,
  Bed,
  Calendar,
  Check,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import RoomAvailabilityChart from "../../components/RoomAvailablityChart";


export default function RecepDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  //const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      {/* Header with Current Time */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-blue-100">
              Here's what's happening at your hotel today
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-blue-100">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* dashboard statistic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-6 gap-5">
        {/* today's check in */}
        <div className="bg-white rounded-lg shadow border-b-4 border-b-blue-400 p-4">
          <p className="text-slate-700">Today's Check-ins</p>
          <p className="flex justify-between items-center py-1">
            <span className="text-3xl font-bold">12</span>
            <span className="bg-blue-200 w-10 h-10 flex items-center justify-center rounded-md">
              <CalendarCheck2 className="text-blue-700" />
            </span>
          </p>

          <p className="flex items-center text-green-500 gap-2 text-sm">
            <ArrowUp className="w-4 h-4" />
            <span className="flex items-center">
              <Plus className="w-4 h-4" />2 from yesterday
            </span>
          </p>
        </div>
        {/* today's check out */}
        <div className="bg-white rounded-lg shadow border-b-4 border-b-orange-400 p-4">
          <p className="text-slate-700">Today's Check-outs</p>
          <p className="flex justify-between items-center py-1">
            <span className="text-3xl font-bold">10</span>
            <span className="bg-orange-200 w-10 h-10 flex items-center justify-center rounded-md">
              <CalendarMinus2Icon className="text-orange-600" />
            </span>
          </p>

          <p className="text-gray-500 gap-2 text-sm">
            <span className="flex items-center">
              <Minus className="w-4 h-4" />
              Same as yesterday
            </span>
          </p>
        </div>
        {/* Available rooms */}
        <div className="bg-white rounded-lg shadow border-b-4 border-b-green-400 p-4">
          <p className="text-slate-700"> Available Rooms</p>
          <p className="flex justify-between items-center py-1">
            <span className="text-3xl font-bold">24</span>
            <span className="bg-green-200 w-10 h-10 flex items-center justify-center rounded-md">
              <Bed className="text-green-600" />
            </span>
          </p>

          <p className="text-gray-500 gap-2 text-sm">
            <span className="flex items-center">
              <Minus className="w-4 h-4" />
              Out of 50 total rooms
            </span>
          </p>
        </div>
        {/* Total bookings */}
        <div className="bg-white rounded-lg shadow border-b-4 border-b-purple-400 p-4">
          <p className="text-slate-700"> Tool Bookings</p>
          <p className="flex justify-between items-center py-1">
            <span className="text-3xl font-bold">36</span>
            <span className="bg-purple-200 w-10 h-10 flex items-center justify-center rounded-md">
              <Calendar className="text-purple-600" />
            </span>
          </p>

          <p className="text-gray-500 gap-2 text-sm">
            <span className="flex items-center">from yesterday</span>
          </p>
        </div>
      </div>

      {/* Room Overview and quick action */}
      <div className="flex flex-col lg:flex-row items-center gap-5">
        {/* room overview status  */}
        <div className="bg-white shadow-sm rounded-md py-4 flex-1">
          <div className="border-b border-gray-300 px-4 pb-4">
            <h1 className="text-lg text-slate-800 font-medium">
              Room Status Overview
            </h1>
            <p className="text-sm text-gray-600"> Current room availability</p>
          </div>

          <div className="grid grid-cols-2 p-2 items-center gap-5">
            <div className="bg-green-100 flex flex-col gap-1 items-center justify-center py-4 rounded-md">
              <span className="bg-green-500 rounded-4xl p-1">
                <Check className="text-[#e8e7e7]" />
              </span>
              <p className="text-2xl text-green-600 font-bold">15</p>
              <p className="text-md text-green-600">Available</p>
            </div>

            <div className="bg-red-100 flex flex-col gap-1 items-center justify-center py-4 rounded-md">
              <span className="bg-red-500 rounded-4xl p-1">
                <Users className="text-[#e8e7e7]" />
              </span>
              <p className="text-2xl text-red-600 font-bold">23</p>
              <p className="text-md text-red-600">Occupied</p>
            </div>
          </div>

          {/* stat */}
          <div className="py-2">
            <RoomAvailabilityChart />
          </div>
        </div>

        {/* quick actions */}
        <div className="flex-1 bg-white shadow-sm rounded-md py-4">
          <div className="border-b border-gray-300 px-4 pb-4">
            <h1 className="text-lg text-slate-800 font-medium">
              Quick Actions
            </h1>
          </div>

         
              <div className="grid grid-cols-2 gap-4 p-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-blue-900">
                    New Check-in
                  </p>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <Calendar className="h-6 w-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-green-900">
                    New Booking
                  </p>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <Bed className="h-6 w-6 text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-purple-900">
                    Room Status
                  </p>
                </button>
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <Users className="h-6 w-6 text-orange-600 mb-2" />
                  <p className="text-sm font-medium text-orange-900">
                    Guest Info
                  </p>
                </button>
                <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                  <CalendarMinus2Icon className="h-6 w-6 text-yellow-600 mb-2" />
                  <p className="text-sm font-medium text-yellow-900">
                    New Check-outs
                  </p>
                </button>
                <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                  <Bed className="h-6 w-6 text-indigo-600 mb-2" />
                  <p className="text-sm font-medium text-indigo-900">
                    Available
                  </p>
                </button>
              </div>
        </div>
      </div>
    </div>
  );
}
