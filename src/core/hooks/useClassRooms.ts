// src/core/hooks/useClassRooms.ts
'use client';

import { useContext } from 'react';
import type { ClassRoomsContextValue } from '@/core/contexts/ClassRoomsProvider';
import { ClassRoomsContext } from '@/core/contexts/ClassRoomsProvider';

export function useClassRooms(): ClassRoomsContextValue {
  const ctx = useContext(ClassRoomsContext);

  if (!ctx) {
    throw new Error('useClassRooms deve ser usado dentro de ClassRoomsProvider');
  }

  return ctx;
}
