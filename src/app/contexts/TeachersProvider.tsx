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
    const newTeacher: Teacher = {
      ...data,
      id: Date.now(),
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id: number, data: TeacherFormData) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTeacher = (id: number) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const getTeacherById = (id: number) => {
    return teachers.find(t => t.id === id);
  };

  return (
    <TeachersContext.Provider
      value={{ teachers, createTeacher, updateTeacher, deleteTeacher, getTeacherById }}
    >
      {children}
    </TeachersContext.Provider>
  );
}
