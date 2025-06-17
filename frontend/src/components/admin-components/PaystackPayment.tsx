import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, CheckCircle } from 'lucide-react';

interface PaystackPaymentProps {
  email: string;
  amount: number;
  name: string;
  bookingCode: string;
  onPaymentSuccess: () => void;
}

export default function PaystackPayment({ 
  email, 
  amount, 
  name, 
  bookingCode,
  onPaymentSuccess 
}: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Paystack configuration
  const config = {
    reference: `booking-${bookingCode}-${Date.now()}`,
    email,
    amount: Math.round(amount * 100), // Paystack expects amount in kobo (multiply by 100)
    publicKey: 'pk_test_your_paystack_public_key_here', // Replace with your actual Paystack public key
    firstname: name.split(' ')[0],
    lastname: name.split(' ')[1] || '',
    currency: 'USD',
  };
  
  // Initialize Paystack
  const initializePayment = usePaystackPayment(config);
  
  // Define callback after payment
  const onSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentSuccess();
      setIsProcessing(false);
    }, 1500);
  };
  
  // Define callback for payment cancellation
  const onClose = () => {
    console.log('Payment closed');
  };

  return (
    <div className="space-y-6">
      {/* Payment information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-center text-blue-800 mb-2 font-medium">
          You are about to pay ${amount.toFixed(2)} for booking #{bookingCode}
        </p>
        <p className="text-center text-gray-600 text-sm">
          Click the button below to complete your payment using Paystack.
        </p>
      </div>
      
      {/* Payment Button */}
      <button
        type="button"
        onClick={() => {
          setIsProcessing(true);
          // @ts-ignore (TypeScript doesn't recognize initializePayment as a function)
          initializePayment(onSuccess, onClose);
        }}
        disabled={isProcessing}
        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay with Card
          </>
        )}
      </button>
      
      {/* Security notice */}
      <div className="text-center text-gray-500 text-xs flex items-center justify-center">
        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
        Secured by Paystack. Your payment information is safe.
      </div>
    </div>
  );
}