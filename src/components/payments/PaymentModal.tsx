'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  XMarkIcon,
  CreditCardIcon,
  UserIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import PaymentForm from './PaymentForm';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface PaymentData {
  paymentId: string;
  amount: number;
  platformFee: number;
  processingFee: number;
  total: number;
  receiver: User;
  description?: string;
}

interface PaymentModalProps {
  onClose: () => void;
  onPaymentCreated: () => void;
  prefilledReceiverId?: string;
  prefilledListingId?: string;
  prefilledAmount?: number;
  prefilledDescription?: string;
}

export default function PaymentModal({
  onClose,
  onPaymentCreated,
  prefilledReceiverId,
  prefilledListingId,
  prefilledAmount,
  prefilledDescription,
}: PaymentModalProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const handleFormSubmit = (data: PaymentData) => {
    setPaymentData(data);
    setStep('payment');
  };

  const handlePaymentComplete = () => {
    onPaymentCreated();
    onClose();
  };

  const handleBack = () => {
    setStep('form');
    setPaymentData(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <CreditCardIcon className="h-6 w-6 mr-2 text-blue-500" />
            {step === 'form' ? 'Send Payment' : 'Complete Payment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' ? (
            <PaymentFormStep
              onSubmit={handleFormSubmit}
              prefilledReceiverId={prefilledReceiverId}
              prefilledListingId={prefilledListingId}
              prefilledAmount={prefilledAmount}
              prefilledDescription={prefilledDescription}
            />
          ) : (
            <PaymentForm
              paymentData={paymentData}
              onComplete={handlePaymentComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface PaymentFormStepProps {
  onSubmit: (data: PaymentData) => void;
  prefilledReceiverId?: string;
  prefilledListingId?: string;
  prefilledAmount?: number;
  prefilledDescription?: string;
}

function PaymentFormStep({
  onSubmit,
  prefilledReceiverId,
  prefilledListingId,
  prefilledAmount,
  prefilledDescription,
}: PaymentFormStepProps) {
  const [receiverId, setReceiverId] = useState(prefilledReceiverId || '');
  const [amount, setAmount] = useState(prefilledAmount?.toString() || '');
  const [description, setDescription] = useState(prefilledDescription || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate fees
  const amountNum = parseFloat(amount) || 0;
  const platformFee = amountNum * 0.02; // 2%
  const processingFee = amountNum * 0.03; // 3%
  const total = amountNum + platformFee + processingFee;

  const handleSearchUsers = async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // Mock search results - in a real app, you'd make an API call
      const mockResults: User[] = [
        { id: 'user1', name: 'John Doe', email: 'john@example.com', image: null },
        { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', image: null },
        { id: 'user3', name: 'Bob Johnson', email: 'bob@example.com', image: null },
      ].filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) || 
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setReceiverId(user.id);
    setSearchTerm(user.name);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiverId || !amount || amountNum <= 0 || !selectedUser) {
      setError('Please select a recipient and enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create payment record
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId,
          amount: amountNum,
          listingId: prefilledListingId || undefined,
          description: description || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const payment = await response.json();
      
      onSubmit({
        paymentId: payment.id,
        amount: amountNum,
        platformFee,
        processingFee,
        total,
        receiver: selectedUser,
        description: description || undefined,
      });
    } catch (err: any) {
      console.error('Error creating payment:', err);
      setError(err.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Recipient Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Send to
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearchUsers(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          placeholder="What is this payment for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fee Breakdown */}
      {amountNum > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <InformationCircleIcon className="h-4 w-4 mr-1" />
            Fee Breakdown
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>${amountNum.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee (2%):</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing fee (3%):</span>
              <span>${processingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !receiverId || !amount || amountNum <= 0}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Creating Payment...' : 'Continue to Payment'}
      </button>
    </form>
  );
}

