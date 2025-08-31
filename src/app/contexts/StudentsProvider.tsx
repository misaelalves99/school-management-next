// src/providers/StudentsProvider.tsx

'use client';

import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import type { Student } from '../types/Student';
import mockStudents from '../mocks/students';
import {
  StudentsContext,
  type StudentsContextType,
} from '../contexts/StudentsContext';

type StudentsProviderProps = {
  children: ReactNode;
};

export function StudentsProvider({ children }: StudentsProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Inicializa com mock (poderia ser fetch da API futuramente)
    setStudents(mockStudents);
  }, []);

  /** Adiciona novo aluno */
  const addStudent = (student: Omit<Student, 'id'>): Student => {
    const newStudent: Student = { ...student, id: Date.now() };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  };

  /** Atualiza aluno existente */
  const updateStudent = (
    id: number,
    updatedStudent: Omit<Student, 'id'>
  ): Student | null => {
    let updated: Student | null = null;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          updated = { ...updatedStudent, id };
          return updated;
        }
        return s;
      })
    );
    return updated;
  };

  /** Remove aluno pelo ID */
  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  /** Retorna aluno pelo ID */
  const getStudentById = (id: number) => students.find((s) => s.id === id);

  /** Força atualização da lista de alunos */
  const refreshStudents = useCallback(() => {
    setStudents((prev) => [...prev]); // apenas dispara re-render
  }, []);

  const contextValue: StudentsContextType = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    refreshStudents,
  };

  return (
    <StudentsContext.Provider value={contextValue}>
      {children}
    </StudentsContext.Provider>
  );
}
