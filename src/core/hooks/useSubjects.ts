// src/core/hooks/useSubjects.ts

'use client';

import { useContext } from 'react';
import { SubjectsContext } from '@/core/contexts/SubjectsProvider';

export function useSubjects() {
  const ctx = useContext(SubjectsContext);

  if (!ctx) {
    throw new Error('useSubjects deve ser usado dentro de SubjectsProvider');
  }

  // ctx já tem os métodos com os nomes certos
  return ctx;
}
