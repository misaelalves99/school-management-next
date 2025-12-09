// src/core/contexts/SubjectsProvider.tsx

'use client';

import { createContext, useState, type ReactNode } from 'react';
import type { Subject } from '@/types/Subject';
import { subjectsMock } from '@/core/mocks/subjects';

interface SubjectsContextValue {
  subjects: Subject[];
  addSubject: (data: Omit<Subject, 'id'>) => Subject;
  updateSubject: (id: number, data: Partial<Omit<Subject, 'id'>>) => boolean;
  removeSubject: (id: number) => void;
  getSubjectById: (id: number) => Subject | undefined;
}

export const SubjectsContext = createContext<SubjectsContextValue | undefined>(
  undefined,
);

interface SubjectsProviderProps {
  children: ReactNode;
}

export function SubjectsProvider({ children }: SubjectsProviderProps) {
  const [subjects, setSubjects] = useState<Subject[]>(subjectsMock);

  const getNextId = () =>
    subjects.length ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;

  const addSubject = (data: Omit<Subject, 'id'>): Subject => {
    const now = new Date().toISOString();

    const newSubject: Subject = {
      ...data,
      id: getNextId(),
      createdAt: (data as any).createdAt ?? now,
      updatedAt: now,
    };

    setSubjects((prev) => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubject = (
    id: number,
    data: Partial<Omit<Subject, 'id'>>,
  ): boolean => {
    let updated = false;

    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id !== id) return subject;
        updated = true;

        const {
          createdAt: _ignoreCreatedAt,
          updatedAt: _ignoreUpdatedAt,
          ...rest
        } = data as any;

        return {
          ...subject,
          ...rest,
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    return updated;
  };

  const removeSubject = (id: number) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const getSubjectById = (id: number) =>
    subjects.find((s) => s.id === id);

  const value: SubjectsContextValue = {
    subjects,
    addSubject,
    updateSubject,
    removeSubject,
    getSubjectById,
  };

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  );
}
