// src/core/contexts/TeachersProvider.tsx
'use client';

import {
  createContext,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import type { Teacher, TeacherFormData } from '@/types/Teacher';
import { teachersMock } from '@/core/mocks/teachers';

export interface TeachersContextValue {
  teachers: Teacher[];

  // API "original"
  createTeacher: (data: TeacherFormData) => Teacher;
  updateTeacher: (id: number, data: TeacherFormData | Omit<Teacher, 'id'>) => boolean;
  deleteTeacher: (id: number) => void;
  getTeacherById: (id: number) => Teacher | undefined;

  // API usada nas páginas novas
  addTeacher: (payload: Omit<Teacher, 'id'>) => Promise<Teacher>;
  removeTeacher: (id: number) => void;
}

export const TeachersContext = createContext<TeachersContextValue | undefined>(
  undefined,
);

interface TeachersProviderProps {
  children: ReactNode;
}

export function TeachersProvider({ children }: TeachersProviderProps): JSX.Element {
  const [teachers, setTeachers] = useState<Teacher[]>(teachersMock);

  const getNextId = useCallback(
    () =>
      teachers.length
        ? Math.max(...teachers.map((t) => t.id)) + 1
        : 1,
    [teachers],
  );

  // ===== API original =====

  const createTeacher = (data: TeacherFormData): Teacher => {
    const now = new Date().toISOString();

    const newTeacher: Teacher = {
      id: getNextId(),
      name: data.name,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      subject: data.subject,
      phone: data.phone,
      address: data.address,
      specialization: (data as any).specialization ?? '',
      createdAt: now,
      updatedAt: now,
    };

    setTeachers((prev) => [...prev, newTeacher]);
    return newTeacher;
  };

  const updateTeacher = (
    id: number,
    data: TeacherFormData | Omit<Teacher, 'id'>,
  ): boolean => {
    let updated = false;

    setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id !== id) return teacher;
        updated = true;

        // Evita sobrescrever createdAt vindo de algum payload acidental
        const {
          createdAt: _ignoreCreatedAt,
          updatedAt: _ignoreUpdatedAt,
          ...restData
        } = data as any;

        return {
          ...teacher,
          ...restData,
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    return updated;
  };

  const deleteTeacher = (id: number): void => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const getTeacherById = (id: number): Teacher | undefined =>
    teachers.find((t) => t.id === id);

  // ===== API nova (usada nas páginas) =====

  const addTeacher = useCallback(
    async (payload: Omit<Teacher, 'id'>): Promise<Teacher> => {
      const now = new Date().toISOString();

      const newTeacher: Teacher = {
        id: getNextId(),
        ...payload,
        createdAt: payload.createdAt ?? now,
        updatedAt: now,
      };

      setTeachers((prev) => [...prev, newTeacher]);
      return newTeacher;
    },
    [getNextId],
  );

  const removeTeacher = useCallback((id: number): void => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: TeachersContextValue = {
    teachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    addTeacher,
    removeTeacher,
  };

  return (
    <TeachersContext.Provider value={value}>
      {children}
    </TeachersContext.Provider>
  );
}
