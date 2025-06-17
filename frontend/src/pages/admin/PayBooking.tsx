import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CreditCard, DollarSign, CheckCircle, Loader2 } from "lucide-react";
import CashPayment from "../../components/admin-components/CashPayment";
import PaystackPayment from "../../components/admin-components/PaystackPayment";

// Update the Booking interface to match the actual response
interface Booking {
  id: string;
  customer_id: string;
  room_id: string;
  room_type_id: string;
  hotel_id: string;
  branch_id: string;
  booking_code: string;
  special_requests: string;
  number_of_guests: number;
  purpose_of_visit: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: string; // API returns this as string
  check_in_date: string;
  check_out_date: string;
  created_at: string;
  updated_at: string | null;
  // Optional fields that might come from joins or additional processing
  customer?: {
    full_name: string;
    email: string;
    phone: string;
  };
  room_type_name?: string;
  room_number?: string;
  nights?: number;
}

// Helper function to add at the top of your component
const getNumericAmount = (amount: string | undefined): number => {
  if (!amount) return 0;
  const parsedAmount = parseFloat(amount);
  return isNaN(parsedAmount) ? 0 : parsedAmount;
};

export default function PayBooking() {
  const { bookingCode } = useParams<{ bookingCode: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://hotel-management-system-5gk8.onrender.com/v1/bookings/code/${bookingCode}`
        );
        
        if (response.data.status === "success") {
          setBooking(response.data.booking);
        } else {
          setError("Booking not found");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError("Failed to load booking information");
      } finally {
        setLoading(false);
      }
    };

    if (bookingCode) {
      fetchBooking();
    }
  }, [bookingCode]);

  const handlePaymentSuccess = async () => {
    try {
      // Update booking payment status to "paid"
      await axios.patch(
        `https://hotel-management-system-5gk8.onrender.com/v1/bookings/${booking?.id}/payment-status`,
        { payment_status: "paid" }
      );

      setPaymentSuccess(true);
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError("Failed to update payment status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading booking information...</span>
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 font-semibold text-lg mb-2">{error}</div>
        <p className="text-gray-600">
          Please check the booking code and try again
        </p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          The booking payment has been completed successfully.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left text-gray-600">Booking Code:</div>
            <div className="text-right font-medium">{booking?.booking_code}</div>
            <div className="text-left text-gray-600">Customer:</div>
            <div className="text-right font-medium">{booking?.customer?.full_name}</div>
            <div className="text-left text-gray-600">Amount Paid:</div>
            <div className="text-right font-medium text-green-600">
              ${getNumericAmount(booking?.total_amount).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <a
            href="/admin/bookings"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Bookings
          </a>
          <a
            href="/admin/dashboard"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold">Complete Payment</h1>
          <p className="text-blue-100">
            Please complete payment for booking #{booking?.booking_code}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Booking Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{booking?.customer?.full_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{booking?.customer?.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{booking?.customer?.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium">{booking?.room_type_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room Number:</span>
                    <span className="font-medium">{booking?.room_number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">
                      {new Date(booking?.check_in_date || "").toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">
                      {new Date(booking?.check_out_date || "").toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nights:</span>
                    <span className="font-medium">{booking?.nights} Night(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{booking?.payment_method}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">
                        ${getNumericAmount(booking?.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  {booking?.payment_method === "Cash" ? (
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  ) : (
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  )}
                  Complete Payment via {booking?.payment_method}
                </h3>

                {booking?.payment_method === "Cash" ? (
                  <CashPayment 
                    totalAmount={getNumericAmount(booking.total_amount)} 
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                ) : (
                  booking?.booking_code ? (
                    <PaystackPayment
                      email={booking?.customer?.email || "guest@example.com"}
                      amount={getNumericAmount(booking?.total_amount)}
                      name={booking?.customer?.full_name || "Guest"}
                      bookingCode={booking?.booking_code}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  ) : (
                    <div className="text-red-600 font-semibold">
                      Booking code is missing. Cannot proceed with payment.
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

