import { renderHook, act } from '@testing-library/react';
import { useClassRooms } from './useClassRooms';
import { ClassRoomsContext, ClassRoomsContextType } from '../contexts/ClassRoomsContext';
import { ReactNode } from 'react';
import type { ClassRoom } from '../types/Classroom';

const mockClassRooms: ClassRoom[] = [
  { id: 1, name: 'Sala A', capacity: 20, schedule: 'Seg 08:00', subjects: [], teachers: [], classTeacher: null },
  { id: 2, name: 'Sala B', capacity: 30, schedule: 'Ter 10:00', subjects: [], teachers: [], classTeacher: null },
];

describe('useClassRooms', () => {
  const mockContext: ClassRoomsContextType = {
    classRooms: mockClassRooms,
    getClassRoomById: jest.fn((id: number) => mockClassRooms.find(r => r.id === id)),
    createClassRoom: jest.fn((data: Omit<ClassRoom, 'id'>) => {
      mockClassRooms.push({ ...data, id: mockClassRooms.length + 1 });
    }),
    updateClassRoom: jest.fn((id: number, data: Omit<ClassRoom, 'id'>) => {
      const index = mockClassRooms.findIndex(r => r.id === id);
      if (index !== -1) mockClassRooms[index] = { ...mockClassRooms[index], ...data };
    }),
    deleteClassRoom: jest.fn((id: number) => {
      const index = mockClassRooms.findIndex(r => r.id === id);
      if (index !== -1) mockClassRooms.splice(index, 1);
    }),
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

  it('chama getClassRoomById corretamente', () => {
    const { result } = renderHook(() => useClassRooms(), { wrapper });
    const room = result.current.getClassRoomById(1);
    expect(room).toEqual(mockClassRooms[0]);
    expect(result.current.getClassRoomById).toHaveBeenCalledWith(1);
  });

  it('chama funções de criação, atualização e exclusão corretamente', () => {
    const { result } = renderHook(() => useClassRooms(), { wrapper });

    // createClassRoom
    act(() =>
      result.current.createClassRoom({ name: 'Sala C', capacity: 25, schedule: '', subjects: [], teachers: [], classTeacher: null })
    );
    expect(result.current.createClassRoom).toHaveBeenCalled();

    // updateClassRoom
    act(() =>
      result.current.updateClassRoom(2, { name: 'Sala B Updated', capacity: 30, schedule: '', subjects: [], teachers: [], classTeacher: null })
    );
    expect(result.current.updateClassRoom).toHaveBeenCalled();

    // deleteClassRoom
    act(() => result.current.deleteClassRoom(1));
    expect(result.current.deleteClassRoom).toHaveBeenCalled();
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useClassRooms())).toThrow(
      'useClassRooms deve ser usado dentro de um ClassRoomsProvider'
    );
  });
});
