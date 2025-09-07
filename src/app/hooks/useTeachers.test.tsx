// src/hooks/useTeachers.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useTeachers } from './useTeachers';
import { TeachersContext, TeachersContextType } from '../contexts/TeachersContext';
import { ReactNode } from 'react';

describe('useTeachers', () => {
  const mockContext: TeachersContextType = {
    teachers: [
      {
        id: 1,
        name: 'Professor 1',
        email: 'p1@email.com',
        phone: '123456789',
        subject: 'Matemática',
        dateOfBirth: '1980-01-01',
        address: 'Rua A, 100',
      },
      {
        id: 2,
        name: 'Professor 2',
        email: 'p2@email.com',
        phone: '987654321',
        subject: 'Português',
        dateOfBirth: '1975-05-05',
        address: 'Rua B, 200',
      },
    ],
    createTeacher: jest.fn((teacher) => {
      mockContext.teachers.push({ ...teacher, id: mockContext.teachers.length + 1 });
    }),
    updateTeacher: jest.fn((id, updatedData) => {
      const index = mockContext.teachers.findIndex((t) => t.id === id);
      if (index !== -1) mockContext.teachers[index] = { id, ...updatedData };
    }),
    deleteTeacher: jest.fn((id) => {
      const index = mockContext.teachers.findIndex((t) => t.id === id);
      if (index !== -1) mockContext.teachers.splice(index, 1);
    }),
    getTeacherById: jest.fn((id) => mockContext.teachers.find((t) => t.id === id)),
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <TeachersContext.Provider value={mockContext}>{children}</TeachersContext.Provider>
  );

  it('retorna o contexto corretamente quando usado dentro do provider', () => {
    const { result } = renderHook(() => useTeachers(), { wrapper });
    expect(result.current).toEqual(mockContext);
  });

  it('chama createTeacher corretamente', () => {
    const { result } = renderHook(() => useTeachers(), { wrapper });
    act(() => {
      result.current.createTeacher({
        name: 'Professor 3',
        email: 'p3@email.com',
        phone: '555555555',
        subject: 'História',
        dateOfBirth: '1990-01-01',
        address: 'Rua C, 300',
      });
    });

    expect(result.current.createTeacher).toHaveBeenCalled();
    expect(result.current.teachers).toHaveLength(3);
    expect(result.current.teachers[2].name).toBe('Professor 3');
  });

  it('chama updateTeacher corretamente', () => {
    const { result } = renderHook(() => useTeachers(), { wrapper });
    act(() => {
      result.current.updateTeacher(1, {
        name: 'Professor 1 Atualizado',
        email: 'p1@email.com',
        phone: '123456789',
        subject: 'Matemática',
        dateOfBirth: '1980-01-01',
        address: 'Rua A, 100',
      });
    });

    expect(result.current.updateTeacher).toHaveBeenCalled();
    expect(result.current.teachers[0].name).toBe('Professor 1 Atualizado');
  });

  it('chama deleteTeacher corretamente', () => {
    const { result } = renderHook(() => useTeachers(), { wrapper });
    act(() => {
      result.current.deleteTeacher(2);
    });

    expect(result.current.deleteTeacher).toHaveBeenCalled();
    expect(result.current.teachers.find((t) => t.id === 2)).toBeUndefined();
  });

  it('chama getTeacherById corretamente', () => {
    const { result } = renderHook(() => useTeachers(), { wrapper });
    const teacher = result.current.getTeacherById(1);

    expect(result.current.getTeacherById).toHaveBeenCalledWith(1);
    expect(teacher?.name).toBe('Professor 1 Atualizado');
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useTeachers())).toThrow(
      'useTeachers deve ser usado dentro de um TeachersProvider'
    );
  });
});
