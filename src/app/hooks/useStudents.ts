// src/hooks/useStudents.ts

'use client';

import { useContext } from 'react';
import { StudentsContext } from '../contexts/StudentsContext';

export function useStudents() {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents deve ser usado dentro de um StudentsProvider');
  }
  return context;
}
