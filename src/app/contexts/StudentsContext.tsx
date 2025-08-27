// src/contexts/StudentsContext.tsx

'use client';

import { createContext } from 'react';
import type { Student } from '../types/Student';

export type StudentsContextType = {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: number, updatedStudent: Omit<Student, 'id'>) => void;
  deleteStudent: (id: number) => void;
  getStudentById: (id: number) => Student | undefined;
};

export const StudentsContext = createContext<StudentsContextType | undefined>(undefined);
