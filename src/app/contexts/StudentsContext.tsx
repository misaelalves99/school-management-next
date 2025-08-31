// src/contexts/StudentsContext.tsx

'use client';

import { createContext } from 'react';
import type { Student } from '../types/Student';

export type StudentsContextType = {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: number, updatedStudent: Omit<Student, 'id'>) => Student | null;
  deleteStudent: (id: number) => void;
  getStudentById: (id: number) => Student | undefined;
  refreshStudents: () => void;
};

export const StudentsContext = createContext<StudentsContextType | undefined>(
  undefined
);
