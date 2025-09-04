// src/app/hooks/useEnrollments.ts

import { useContext } from 'react';
import { EnrollmentsContext } from '../contexts/EnrollmentsContext';
import type { EnrollmentsContextType } from '../contexts/EnrollmentsContext';

export const useEnrollments = () => {
  const context = useContext(EnrollmentsContext);
  if (!context) throw new Error('useEnrollments deve ser usado dentro de EnrollmentsProvider');
  return context as EnrollmentsContextType;
};
