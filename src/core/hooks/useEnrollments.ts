// src/core/hooks/useEnrollments.ts
'use client';

import { useContext } from 'react';
import { EnrollmentsContext } from '@/core/contexts/EnrollmentsProvider';

export function useEnrollments() {
  const ctx = useContext(EnrollmentsContext);
  if (!ctx) {
    throw new Error(
      'useEnrollments deve ser usado dentro de EnrollmentsProvider',
    );
  }
  return ctx;
}
