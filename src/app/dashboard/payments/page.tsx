'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import PaymentModal from '@/components/payments/PaymentModal';

interface Payment {
  id: string;
  amount: number;
  platformFee: number;
  processingFee: number;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  description?: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  listing?: {
    id: string;
    title: string;
    type: string;
  };
}

interface PaymentHistory {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function PaymentsPage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('type', filter);
      }

      const response = await fetch(`/api/payments?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data: PaymentHistory = await response.json();
      setPayments(data.payments);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'REFUNDED':
        return <ArrowPathIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isPaymentSent = (payment: Payment) => {
    return payment.sender.id === session?.user?.id;
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetail(true);
  };

  const handlePaymentCreated = () => {
    fetchPayments(); // Refresh the payments list
    setShowPaymentModal(false);
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <p className="text-center">Please sign in to view your payments.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Payments</h1>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Send Payment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setFilter('all')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Payments
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              filter === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              filter === 'received'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Received
          </button>
        </nav>
      </div>

      {/* Payment List */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchPayments}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-10">
          <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No payments found.</p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send Your First Payment
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <div key={payment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {isPaymentSent(payment) ? (
                        <ArrowUpIcon className="h-6 w-6 text-red-500" />
                      ) : (
                        <ArrowDownIcon className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {isPaymentSent(payment) ? 'Sent to' : 'Received from'}{' '}
                          {isPaymentSent(payment) ? payment.receiver.name : payment.sender.name}
                        </p>
                        {getStatusIcon(payment.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {payment.listing ? `For: ${payment.listing.title}` : payment.description || 'No description'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()} at{' '}
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Total: ${payment.total.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewPayment(payment)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentCreated={handlePaymentCreated}
        />
      )}

      {/* Payment Detail Modal */}
      {showPaymentDetail && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Payment Details</h3>
                <button
                  onClick={() => setShowPaymentDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-lg font-semibold">${selectedPayment.amount.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Platform Fee (2%)</p>
                  <p className="text-sm">${selectedPayment.platformFee.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Processing Fee (3%)</p>
                  <p className="text-sm">${selectedPayment.processingFee.toFixed(2)}</p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg font-semibold">${selectedPayment.total.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedPayment.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                      {selectedPayment.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {isPaymentSent(selectedPayment) ? 'Sent to' : 'Received from'}
                  </p>
                  <p className="text-sm">
                    {isPaymentSent(selectedPayment) ? selectedPayment.receiver.name : selectedPayment.sender.name}
                  </p>
                </div>
                
                {selectedPayment.listing && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Related Listing</p>
                    <p className="text-sm">{selectedPayment.listing.title}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm">
                    {new Date(selectedPayment.createdAt).toLocaleDateString()} at{' '}
                    {new Date(selectedPayment.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

