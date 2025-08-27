// src/providers/StudentsProvider.tsx

'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { Student } from '../types/Student';
import mockStudents from '../mocks/students';
import { StudentsContext } from '../contexts/StudentsContext';

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
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...student, id: Date.now() }; // gera ID único
    setStudents(prev => [...prev, newStudent]);
  };

  /** Atualiza aluno existente */
  const updateStudent = (id: number, updatedStudent: Omit<Student, 'id'>) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...updatedStudent, id } : s))
    );
  };

  /** Remove aluno pelo ID */
  const deleteStudent = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  /** Retorna aluno pelo ID */
  const getStudentById = (id: number) => {
    return students.find(s => s.id === id);
  };

  return (
    <StudentsContext.Provider
      value={{ students, addStudent, updateStudent, deleteStudent, getStudentById }}
    >
      {children}
    </StudentsContext.Provider>
  );
}
