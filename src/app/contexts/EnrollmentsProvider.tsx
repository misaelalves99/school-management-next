// src/app/contexts/EnrollmentsProvider.tsx

import { useState, ReactNode } from 'react';
import { EnrollmentsContext } from './EnrollmentsContext';
import type { EnrollmentWithNames } from '../types/Enrollment';
import { mockEnrollmentsWithNames } from '../mocks/enrollments';

interface EnrollmentsProviderProps {
  children: ReactNode;
}

export const EnrollmentsProvider: React.FC<EnrollmentsProviderProps> = ({ children }) => {
  const [enrollments, setEnrollments] = useState<EnrollmentWithNames[]>([...mockEnrollmentsWithNames]);

  const addEnrollment = (enrollment: EnrollmentWithNames) => {
    setEnrollments((prev) => [...prev, enrollment]);
  };

  const updateEnrollment = (enrollment: EnrollmentWithNames) => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === enrollment.id ? { ...e, ...enrollment } : e))
    );
  };

  const deleteEnrollment = (id: number) => {
    setEnrollments((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EnrollmentsContext.Provider
      value={{ enrollments, addEnrollment, updateEnrollment, deleteEnrollment }}
    >
      {children}
    </EnrollmentsContext.Provider>
  );
};
