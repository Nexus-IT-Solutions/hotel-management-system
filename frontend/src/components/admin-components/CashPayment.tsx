import { useState } from "react";
import { DollarSign, CheckCircle, AlertTriangle } from "lucide-react";

interface CashPaymentProps {
  totalAmount: number;
  onPaymentSuccess: () => void;
}

export default function CashPayment({ totalAmount, onPaymentSuccess }: CashPaymentProps) {
  const [cashReceived, setCashReceived] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCashReceived(value);
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const calculateChange = (): number => {
    const cashAmount = parseFloat(cashReceived) || 0;
    return cashAmount - totalAmount;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const cashAmount = parseFloat(cashReceived) || 0;
    
    if (cashAmount < totalAmount) {
      setError(`Insufficient amount. Please collect at least $${totalAmount.toFixed(2)}`);
      return;
    }
    
    // Process the payment
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess();
    }, 1500);
  };

  const change = calculateChange();

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Cash Received Input */}
        <div>
          <label htmlFor="cashAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Cash Amount Received
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="cashAmount"
              name="cashAmount"
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`pl-10 w-full px-4 py-3 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={cashReceived}
              onChange={handleCashChange}
              required
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" /> {error}
            </p>
          )}
        </div>

        {/* Amount Due */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between text-sm font-medium">
            <span>Amount Due:</span>
            <span className="text-blue-700">${typeof totalAmount === 'number' ? totalAmount.toFixed(2) : "0.00"}</span>
          </div>
        </div>

        {/* Change Calculation */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Change to Return:</span>
            <span className={`font-bold ${change < 0 ? "text-red-600" : "text-green-600"}`}>
              ${change >= 0 ? change.toFixed(2) : "0.00"}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing || parseFloat(cashReceived) < totalAmount}
          className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {processing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Cash Payment
            </>
          )}
        </button>
      </div>
    </form>
  );
}