// src/app/contexts/EnrollmentsContext.ts

import { createContext } from 'react';
import type { EnrollmentWithNames } from '../types/Enrollment';

export type EnrollmentsContextType = {
  enrollments: EnrollmentWithNames[];
  addEnrollment: (enrollment: EnrollmentWithNames) => void;
  updateEnrollment: (enrollment: EnrollmentWithNames) => void;
  deleteEnrollment: (id: number) => void;
};

export const EnrollmentsContext = createContext<EnrollmentsContextType | undefined>(undefined);
