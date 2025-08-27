'use client';

import { createContext } from 'react';
import type { Subject } from '../types/Subject';

export type SubjectsContextType = {
  subjects: Subject[];
  createSubject: (data: Omit<Subject, 'id'>) => void;
  updateSubject: (id: number, data: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: number) => void;
  getSubjectById: (id: number) => Subject | undefined;
};

export const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);
