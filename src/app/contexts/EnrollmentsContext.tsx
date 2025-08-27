// src/app/contexts/EnrollmentsContext.tsx

import { createContext } from 'react';
import type { Enrollment } from '../types/Enrollment';

export interface EnrollmentsContextType {
  enrollments: Enrollment[];
  addEnrollment: (enrollment: Enrollment) => void;
  updateEnrollment: (enrollment: Enrollment) => void;
  deleteEnrollment: (id: number) => void;
}

export const EnrollmentsContext = createContext<EnrollmentsContextType>({
  enrollments: [],
  addEnrollment: () => {},
  updateEnrollment: () => {},
  deleteEnrollment: () => {},
});
