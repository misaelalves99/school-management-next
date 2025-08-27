// src/contexts/ClassRoomsContext.tsx

'use client';

import { createContext } from 'react';
import type { ClassRoom } from '../types/Classroom';

export type ClassRoomsContextType = {
  classRooms: ClassRoom[];
  getClassRoomById: (id: number) => ClassRoom | undefined;
  createClassRoom: (data: Omit<ClassRoom, 'id'>) => void;
  updateClassRoom: (id: number, data: Omit<ClassRoom, 'id'>) => void;
  deleteClassRoom: (id: number) => void;
};

export const ClassRoomsContext = createContext<ClassRoomsContextType | undefined>(undefined);
