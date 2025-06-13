import { Search, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import BookingsTable from "../../components/admin-components/BookingsTable";

export default function Bookings() {
  

//   const handleDelete = () => {
//     Swal.fire({
//   title: "Are you sure?",
//   text: "You won't be able to revert this!",
//   icon: "warning",
//   showCancelButton: true,
//   confirmButtonColor: "#d33",
//   cancelButtonColor: "#B3B3B3",
//   confirmButtonText: "Yes, delete it!"
// }).then((result) => {
//   if (result.isConfirmed) {
//     Swal.fire({
//       title: "Deleted!",
//       text: "Your record has been deleted.",
//       icon: "success"
//     });
//   }
// });
//   }

  return (
    <div className="space-y-6">
      {/* welcome information */}
      <div className="md:px-6 px-2 py-4">
        <h1 className="text-2xl text-slate-800 font-bold tracking-wide">
          Bookings
        </h1>
        <p className="text-gray-500">
          Welcome back, manage your hotel efficiently
        </p>
      </div>
      {/* search section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-5 md:items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select className="px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="../new-booking"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      <BookingsTable/>
     
    </div>
  );
}
