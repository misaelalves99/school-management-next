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
    const lastRoom = classRooms[classRooms.length - 1];
    const nextId = lastRoom ? lastRoom.id + 1 : 1;

    const newRoom: ClassRoom = { ...data, id: nextId };
    setClassRooms(prev => [...prev, newRoom]);
    mockClassRooms.push(newRoom); // atualiza mock global
  };

  const updateClassRoom = (id: number, data: Omit<ClassRoom, 'id'>) => {
    setClassRooms(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data, id } : c))
    );

    const index = mockClassRooms.findIndex(c => c.id === id);
    if (index !== -1) mockClassRooms[index] = { ...mockClassRooms[index], ...data };
  };

  const deleteClassRoom = (id: number) => {
    setClassRooms(prev => prev.filter(c => c.id !== id));
    const index = mockClassRooms.findIndex(c => c.id === id);
    if (index !== -1) mockClassRooms.splice(index, 1);
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
