// src/app/context/SubjectsProvider.tsx

'use client';

import { useState, ReactNode } from 'react';
import { SubjectsContext } from './SubjectsContext';
import type { Subject } from '../types/Subject';

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Matemática', description: 'Estudo de números', workloadHours: 60 },
    { id: 2, name: 'Física', description: 'Estudo da matéria e energia', workloadHours: 60 },
  ]);

  const createSubject = (data: Omit<Subject, 'id'>) => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id || 0)) + 1 : 1;
    setSubjects(prev => [...prev, { ...data, id: newId }]);
  };

  const updateSubject = (id: number, data: Omit<Subject, 'id'>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSubject = (id: number) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const getSubjectById = (id: number) => subjects.find(s => s.id === id);

  return (
    <SubjectsContext.Provider value={{ subjects, createSubject, updateSubject, deleteSubject, getSubjectById }}>
      {children}
    </SubjectsContext.Provider>
  );
}
