// src/core/contexts/EnrollmentsProvider.tsx
'use client';

import {
  createContext,
  useState,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react';
import type {
  Enrollment,
  EnrollmentForm,
  EnrollmentWithNames,
} from '@/types/Enrollment';
import { enrollmentsMock } from '@/core/mocks/enrollments';
import { studentsMock } from '@/core/mocks/students';
import { classRoomsMock } from '@/core/mocks/classRooms';

export interface EnrollmentsContextValue {
  enrollments: Enrollment[];
  enrollmentsWithNames: EnrollmentWithNames[];
  createEnrollment: (data: EnrollmentForm) => Enrollment;
  updateEnrollment: (id: number, data: EnrollmentForm) => boolean;
  deleteEnrollment: (id: number) => void;
  getEnrollmentById: (id: number) => Enrollment | undefined;
}

export const EnrollmentsContext =
  createContext<EnrollmentsContextValue | undefined>(undefined);

interface EnrollmentsProviderProps {
  children: ReactNode;
}

export function EnrollmentsProvider({
  children,
}: EnrollmentsProviderProps): JSX.Element {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(enrollmentsMock);

  const getNextId = useCallback(
    () =>
      enrollments.length
        ? Math.max(...enrollments.map((e) => e.id)) + 1
        : 1,
    [enrollments],
  );

  const mapToWithNames = useCallback(
    (items: Enrollment[]): EnrollmentWithNames[] =>
      items.map((e) => {
        const student = studentsMock.find((s) => s.id === e.studentId);
        const classRoom = classRoomsMock.find((c) => c.id === e.classRoomId);

        return {
          ...e,
          studentName: student?.name ?? 'Aluno não encontrado',
          classRoomName: classRoom?.name ?? 'Turma não encontrada',
        };
      }),
    [],
  );

  const enrollmentsWithNames = useMemo(
    () => mapToWithNames(enrollments),
    [enrollments, mapToWithNames],
  );

  const createEnrollment = (data: EnrollmentForm): Enrollment => {
    const now = new Date().toISOString();

    const newEnrollment: Enrollment = {
      id: getNextId(),
      studentId: Number(data.studentId),
      classRoomId: Number(data.classRoomId),
      enrollmentDate: data.enrollmentDate,
      status: data.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    setEnrollments((prev) => [...prev, newEnrollment]);
    return newEnrollment;
  };

  const updateEnrollment = (id: number, data: EnrollmentForm): boolean => {
    let updated = false;

    setEnrollments((prev) =>
      prev.map((enrollment) => {
        if (enrollment.id !== id) return enrollment;
        updated = true;

        return {
          ...enrollment,
          studentId: Number(data.studentId),
          classRoomId: Number(data.classRoomId),
          enrollmentDate: data.enrollmentDate,
          status: data.status || enrollment.status,
          // se vier de mock sem createdAt, garante um valor
          createdAt: enrollment.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    return updated;
  };

  const deleteEnrollment = (id: number): void => {
    setEnrollments((prev) => prev.filter((e) => e.id !== id));
  };

  const getEnrollmentById = (id: number): Enrollment | undefined =>
    enrollments.find((e) => e.id === id);

  const value: EnrollmentsContextValue = {
    enrollments,
    enrollmentsWithNames,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getEnrollmentById,
  };

  return (
    <EnrollmentsContext.Provider value={value}>
      {children}
    </EnrollmentsContext.Provider>
  );
}
