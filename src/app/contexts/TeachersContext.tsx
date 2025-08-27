// src/contexts/TeachersContext.tsx

'use client';

import { createContext } from 'react';
import type { Teacher, TeacherFormData } from '../types/Teacher';

export type TeachersContextType = {
  teachers: Teacher[];
  createTeacher: (data: TeacherFormData) => void;
  updateTeacher: (id: number, data: TeacherFormData) => void;
  deleteTeacher: (id: number) => void;
  getTeacherById: (id: number) => Teacher | undefined;
};

export const TeachersContext = createContext<TeachersContextType | undefined>(undefined);
