'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Form';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token') || null;
  const sent = searchParams?.get('sent') || null;
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error' | 'missing'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (sent) {
      setStatus('idle');
      setMessage('A verification email has been sent. Please check your inbox.');
      return;
    }
    if (!token) {
      setStatus('missing');
      setMessage('No verification token provided.');
      return;
    }
    setStatus('verifying');
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage('Your email has been verified! You can now log in.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Verification failed.');
      });
  }, [token, sent]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        <div className={`rounded-md p-4 ${status === 'success' ? 'bg-green-50' : status === 'error' ? 'bg-red-50' : 'bg-blue-50'}`}>
          <div className={`text-sm ${status === 'success' ? 'text-green-700' : status === 'error' ? 'text-red-700' : 'text-blue-700'}`}>{message}</div>
        </div>
        {status === 'success' && (
          <Button className="w-full" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        )}
      </div>
    </div>
  );
} 