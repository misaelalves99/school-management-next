// src/core/hooks/useTeachers.ts
'use client';

import { useContext } from 'react';
import { TeachersContext } from '@/core/contexts/TeachersProvider';

export function useTeachers() {
  const ctx = useContext(TeachersContext);
  if (!ctx) {
    throw new Error('useTeachers deve ser usado dentro de TeachersProvider');
  }
  return ctx;
}
