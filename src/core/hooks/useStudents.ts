// src/core/hooks/useStudents.ts
'use client';

import { useContext } from 'react';
import { StudentsContext } from '@/core/contexts/StudentsProvider';

export function useStudents() {
  const ctx = useContext(StudentsContext);
  if (!ctx) {
    throw new Error('useStudents deve ser usado dentro de StudentsProvider');
  }
  return ctx;
}
