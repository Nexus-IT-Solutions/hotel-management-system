

// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CardContent } from "../components/ui/card";

const data = [
  {
    name: "Standard Rooms",
    available: 8,
    total: 20,
    color: "#1E40AF", // blue
  },
  {
    name: "Deluxe Suites",
    available: 5,
    total: 20,
    color: "#F59E0B", // orange
  },
  {
    name: "Executive Suites",
    available: 2,
    total: 10,
    color: "#10B981", // green
  },
];

const RoomAvailabilityChart = () => {
  return (
    <div className="p-1 space-y-1">
      {data.map((room) => {
        const percentAvailable = (room.available / room.total) * 100;
        return (
          <div key={room.name} className="p-1">
            <CardContent>
              <div className="flex justify-between">
                <span className="font-medium text-sm text-gray-700">{room.name}</span>
                <span className="font-medium text-sm text-gray-900">
                  {room.available}/{room.total} available
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${percentAvailable}%`,
                    backgroundColor: room.color,
                  }}
                ></div>
              </div>
            </CardContent>
          </div>
        );
      })}
    </div>
  );
};

export default RoomAvailabilityChart;


