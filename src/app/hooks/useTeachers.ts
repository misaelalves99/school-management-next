// src/hooks/useTeachers.ts

'use client';

import { useContext } from 'react';
import { TeachersContext, TeachersContextType } from '../contexts/TeachersContext';

export function useTeachers(): TeachersContextType {
  const context = useContext(TeachersContext);
  if (!context) {
    throw new Error('useTeachers deve ser usado dentro de um TeachersProvider');
  }
  return context;
}
