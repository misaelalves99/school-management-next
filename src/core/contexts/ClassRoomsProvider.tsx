// src/core/contexts/ClassRoomsProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  useCallback,
} from 'react';

import type { ClassRoom } from '@/types/ClassRoom';
import { classRoomsMock } from '@/core/mocks/classRooms';

export type CreateClassRoomInput = {
  name: string;
  schedule: string;
  capacity: number;
};

export type ClassRoomsContextValue = {
  classRooms: ClassRoom[];
  createClassRoom: (input: CreateClassRoomInput) => ClassRoom;
  updateClassRoom: (id: number, input: Partial<CreateClassRoomInput>) => void;
  deleteClassRoom: (id: number) => void;
  findById: (id: number) => ClassRoom | undefined;
};

export const ClassRoomsContext =
  createContext<ClassRoomsContextValue | undefined>(undefined);

type ClassRoomsProviderProps = {
  children: ReactNode;
};

export function ClassRoomsProvider({
  children,
}: ClassRoomsProviderProps): JSX.Element {
  const [classRooms, setClassRooms] = useState<ClassRoom[]>(classRoomsMock);

  const getNextId = useCallback(
    () =>
      classRooms.length
        ? Math.max(...classRooms.map((room) => room.id)) + 1
        : 1,
    [classRooms],
  );

  const createClassRoom = (input: CreateClassRoomInput): ClassRoom => {
    const now = new Date().toISOString();

    const newClassRoom: ClassRoom = {
      id: getNextId(),
      name: input.name,
      schedule: input.schedule,
      capacity: input.capacity,
      teachers: [],
      subjects: [],
      classTeacher: null,
      createdAt: now,
      updatedAt: now,
    };

    setClassRooms((prev) => [...prev, newClassRoom]);
    return newClassRoom;
  };

  const updateClassRoom = (
    id: number,
    input: Partial<CreateClassRoomInput>,
  ): void => {
    setClassRooms((prev) =>
      prev.map((room) => {
        if (room.id !== id) return room;

        const next: ClassRoom = {
          ...room,
          ...('name' in input && input.name !== undefined
            ? { name: input.name }
            : {}),
          ...('schedule' in input && input.schedule !== undefined
            ? { schedule: input.schedule }
            : {}),
          ...('capacity' in input && input.capacity !== undefined
            ? { capacity: input.capacity }
            : {}),
          updatedAt: new Date().toISOString(),
        };

        return next;
      }),
    );
  };

  const deleteClassRoom = (id: number): void => {
    setClassRooms((prev) => prev.filter((room) => room.id !== id));
  };

  const findById = (id: number): ClassRoom | undefined =>
    classRooms.find((room) => room.id === id);

  const value = useMemo<ClassRoomsContextValue>(
    () => ({
      classRooms,
      createClassRoom,
      updateClassRoom,
      deleteClassRoom,
      findById,
    }),
    [classRooms, createClassRoom, updateClassRoom],
  );

  return (
    <ClassRoomsContext.Provider value={value}>
      {children}
    </ClassRoomsContext.Provider>
  );
}

export function useClassRoomsContext(): ClassRoomsContextValue {
  const ctx = useContext(ClassRoomsContext);
  if (!ctx) {
    throw new Error(
      'useClassRoomsContext deve ser usado dentro de ClassRoomsProvider',
    );
  }
  return ctx;
}
