// src/app/hooks/useClassRooms.ts

'use client';

import { useContext } from 'react';
import { ClassRoomsContext } from '../contexts/ClassRoomsContext';

export function useClassRooms() {
  const context = useContext(ClassRoomsContext);
  if (!context) {
    throw new Error('useClassRooms deve ser usado dentro de um ClassRoomsProvider');
  }
  return context;
}
