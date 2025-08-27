// src/app/hooks/useSubjects.ts

'use client';

import { useContext } from 'react';
import { SubjectsContext } from '../contexts/SubjectsContext';

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error('useSubjects deve ser usado dentro de um SubjectsProvider');
  }
  return context;
}
