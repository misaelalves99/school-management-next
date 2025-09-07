// src/providers/TeachersProvider.tsx

'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { TeachersContext } from '../contexts/TeachersContext';
import type { Teacher, TeacherFormData } from '../types/Teacher';
import teachersData from '../mocks/teachers';

type TeachersProviderProps = {
  children: ReactNode;
};

export function TeachersProvider({ children }: TeachersProviderProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    setTeachers(teachersData); // inicializa com mock
  }, []);

  const createTeacher = (data: TeacherFormData) => {
    // ✅ Gerar ID sequencial
    const lastTeacher = teachers[teachers.length - 1];
    const nextId = lastTeacher ? lastTeacher.id + 1 : 1;

    const newTeacher: Teacher = {
      ...data,
      id: nextId,
    };

    setTeachers(prev => [...prev, newTeacher]);
    teachersData.push(newTeacher); // atualiza mock global
  };

  const updateTeacher = (id: number, data: TeacherFormData) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
    const index = teachersData.findIndex(t => t.id === id);
    if (index !== -1) teachersData[index] = { ...teachersData[index], ...data };
  };

  const deleteTeacher = (id: number) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    teachersData.splice(
      teachersData.findIndex(t => t.id === id),
      1
    );
  };

  const getTeacherById = (id: number) => teachers.find(t => t.id === id);

  return (
    <TeachersContext.Provider
      value={{ teachers, createTeacher, updateTeacher, deleteTeacher, getTeacherById }}
    >
      {children}
    </TeachersContext.Provider>
  );
}
