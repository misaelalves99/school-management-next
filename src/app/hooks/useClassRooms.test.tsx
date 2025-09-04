// src/app/hooks/useClassRooms.test.tsx

import { renderHook } from '@testing-library/react';
import { useClassRooms } from './useClassRooms';
import { ClassRoomsContext, ClassRoomsContextType } from '../contexts/ClassRoomsContext';
import { ReactNode } from 'react';

// Mock completo de ClassRoom
const mockClassRooms = [
  { id: 1, name: 'Sala A', capacity: 20, schedule: 'Seg 08:00', subjects: [], teachers: [], classTeacher: null },
  { id: 2, name: 'Sala B', capacity: 30, schedule: 'Ter 10:00', subjects: [], teachers: [], classTeacher: null },
];

describe('useClassRooms', () => {
  const mockContext: ClassRoomsContextType = {
    classRooms: mockClassRooms,
    getClassRoomById: jest.fn((id: number) => mockClassRooms.find(r => r.id === id)),
    createClassRoom: jest.fn(),
    updateClassRoom: jest.fn(),
    deleteClassRoom: jest.fn(),
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ClassRoomsContext.Provider value={mockContext}>
      {children}
    </ClassRoomsContext.Provider>
  );

  it('retorna o contexto corretamente quando usado dentro do provider', () => {
    const { result } = renderHook(() => useClassRooms(), { wrapper });
    expect(result.current).toEqual(mockContext);
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useClassRooms())).toThrow(
      'useClassRooms deve ser usado dentro de um ClassRoomsProvider'
    );
  });
});
