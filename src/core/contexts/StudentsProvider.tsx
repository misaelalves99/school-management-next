// src/core/contexts/StudentsProvider.tsx
'use client';

import { createContext, useState, type ReactNode } from 'react';
import type { Student } from '@/types/Student';
import { studentsMock } from '@/core/mocks/students';

interface StudentsContextValue {
  students: Student[];
  createStudent: (data: Omit<Student, 'id'>) => Student;
  updateStudent: (id: number, data: Partial<Omit<Student, 'id'>>) => boolean;
  deleteStudent: (id: number) => void;
  getStudentById: (id: number) => Student | undefined;
}

export const StudentsContext = createContext<StudentsContextValue | undefined>(
  undefined,
);

interface StudentsProviderProps {
  children: ReactNode;
}

export function StudentsProvider({ children }: StudentsProviderProps) {
  const [students, setStudents] = useState<Student[]>(studentsMock);

  const getNextId = () =>
    students.length ? Math.max(...students.map((s) => s.id!)) + 1 : 1;

  const createStudent = (data: Omit<Student, 'id'>): Student => {
    const now = new Date().toISOString();

    const newStudent: Student = {
      ...data,
      id: getNextId(),
      createdAt: now,
      updatedAt: now,
    };

    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (
    id: number,
    data: Partial<Omit<Student, 'id'>>,
  ): boolean => {
    let updated = false;

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;

        updated = true;

        // Evita que createdAt/updatedAt vindos do formulário sobrescrevam
        // o que controlamos aqui no provider
        const {
          createdAt: _ignoreCreatedAt,
          updatedAt: _ignoreUpdatedAt,
          ...restData
        } = data as Partial<Student>;

        return {
          ...student,
          ...restData,
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    return updated;
  };

  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const getStudentById = (id: number) =>
    students.find((s) => s.id === id);

  const value: StudentsContextValue = {
    students,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
  };

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
}
