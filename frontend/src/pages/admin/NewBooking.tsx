import BookingForm from "../../components/BookingForms";

export default function NewBooking() {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Create New Booking</h2>
        <p className="text-gray-600 mt-1">
          Fill in the details to create a new reservation
        </p>
      </div>

      {/* forms */}
       <div className="p-6">
        <BookingForm/> 
       </div>
    </div>
  );
}
