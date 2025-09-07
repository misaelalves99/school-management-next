// src/providers/StudentsProvider.tsx

'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import type { Student } from '../types/Student';
import mockStudents from '../mocks/students';
import { StudentsContext, type StudentsContextType } from '../contexts/StudentsContext';

type StudentsProviderProps = {
  children: ReactNode;
};

export function StudentsProvider({ children }: StudentsProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setStudents(mockStudents); // inicializa com mock
  }, []);

  /** Adiciona novo aluno com ID sequencial */
  const addStudent = (student: Omit<Student, 'id'>): Student => {
    const lastStudent = students[students.length - 1];
    const nextId = lastStudent?.id ? lastStudent.id + 1 : 1;

    const newStudent: Student = { ...student, id: nextId };
    setStudents(prev => [...prev, newStudent]);
    mockStudents.push(newStudent); // atualiza mock global
    return newStudent;
  };

  /** Atualiza aluno existente */
  const updateStudent = (id: number, updatedStudent: Omit<Student, 'id'>): Student | null => {
    let updated: Student | null = null;
    setStudents(prev =>
      prev.map(s => {
        if (s.id === id) {
          updated = { ...updatedStudent, id };
          return updated;
        }
        return s;
      })
    );

    const index = mockStudents.findIndex(s => s.id === id);
    if (index !== -1) mockStudents[index] = updated!;
    return updated;
  };

  /** Remove aluno */
  const deleteStudent = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    const index = mockStudents.findIndex(s => s.id === id);
    if (index !== -1) mockStudents.splice(index, 1);
  };

  /** Busca aluno pelo ID */
  const getStudentById = (id: number) => students.find(s => s.id === id);

  /** Força atualização da lista */
  const refreshStudents = () => setStudents(prev => [...prev]);

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
