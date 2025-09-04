// src/providers/ClassRoomsProvider.tsx

'use client';

import { ReactNode, useState, useEffect } from 'react';
import { ClassRoomsContext } from '../contexts/ClassRoomsContext';
import type { ClassRoom } from '../types/Classroom';
import { mockClassRooms } from '../mocks/classRooms';

type ClassRoomsProviderProps = { children: ReactNode };

export function ClassRoomsProvider({ children }: ClassRoomsProviderProps) {
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);

  useEffect(() => {
    setClassRooms([...mockClassRooms]);
  }, []);

  const createClassRoom = (data: Omit<ClassRoom, 'id'>) => {
    const newRoom: ClassRoom = { ...data, id: Date.now() };
    setClassRooms(prev => [...prev, newRoom]);
  };

  const updateClassRoom = (id: number, data: Omit<ClassRoom, 'id'>) => {
    setClassRooms(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data, id } : c))
    );
  };

  const deleteClassRoom = (id: number) => {
    setClassRooms(prev => prev.filter(c => c.id !== id));
  };

  const getClassRoomById = (id: number) => classRooms.find(c => c.id === id);

  return (
    <ClassRoomsContext.Provider
      value={{ classRooms, getClassRoomById, createClassRoom, updateClassRoom, deleteClassRoom }}
    >
      {children}
    </ClassRoomsContext.Provider>
  );
}
