'use client';

import { Suspense } from 'react';
import VerifyEmailForm from '@/components/forms/VerifyEmailForm';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
} 