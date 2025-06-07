'use client';

import { useState } from 'react';
import {
  CreditCardIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface PaymentFormProps {
  paymentData: {
    paymentId: string;
    amount: number;
    platformFee: number;
    processingFee: number;
    total: number;
    receiver: {
      id: string;
      name: string;
      email: string;
    };
    description?: string;
  };
  onComplete: () => void;
  onBack: () => void;
}

export default function PaymentForm({
  paymentData,
  onComplete,
  onBack,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return;
    }
    
    if (!cardName) {
      setError('Please enter the name on card');
      return;
    }
    
    if (expiryDate.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (cvc.length !== 3) {
      setError('Please enter a valid 3-digit CVC');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: paymentData.paymentId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process payment');
      }
      
      // In a real app, you would use Stripe.js to handle the payment
      // For this demo, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update payment status to completed
      const updateResponse = await fetch(`/api/payments/${paymentData.paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'COMPLETED',
        }),
      });
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Failed to update payment status');
      }
      
      setPaymentSuccess(true);
      
      // Wait a moment before closing
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Payment Successful!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Your payment of ${paymentData.total.toFixed(2)} to {paymentData.receiver.name} has been processed successfully.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Payment Summary</h3>
        <div className="mt-2 bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-500">Amount:</span>
            <span className="text-sm font-medium">${paymentData.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-500">Platform fee (2%):</span>
            <span className="text-sm">${paymentData.platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-500">Processing fee (3%):</span>
            <span className="text-sm">${paymentData.processingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
            <span className="text-sm font-medium">Total:</span>
            <span className="text-sm font-medium">${paymentData.total.toFixed(2)}</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          To: {paymentData.receiver.name}
        </p>
        {paymentData.description && (
          <p className="mt-1 text-sm text-gray-500">
            For: {paymentData.description}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCardIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={19}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name on Card
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={5}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={3}
            />
          </div>
        </div>

        <div className="flex items-center">
          <LockClosedIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-xs text-gray-500">
            Your payment information is encrypted and secure.
          </span>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay $${paymentData.total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
}

