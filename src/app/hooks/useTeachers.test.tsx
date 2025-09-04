// src/hooks/useTeachers.test.tsx

import { renderHook } from '@testing-library/react';
import { useTeachers } from './useTeachers';
import { TeachersContext, TeachersContextType } from '../contexts/TeachersContext';
import { ReactNode } from 'react';

describe('useTeachers', () => {
  // Mock completo de Teacher
  const mockContext: TeachersContextType = {
    teachers: [
      {
        id: 1,
        name: 'Professor 1',
        email: 'p1@email.com',
        phone: '123456789',
        subject: 'Matemática',
        dateOfBirth: '1980-01-01',
        address: 'Rua A, 100'
      },
      {
        id: 2,
        name: 'Professor 2',
        email: 'p2@email.com',
        phone: '987654321',
        subject: 'Português',
        dateOfBirth: '1975-05-05',
        address: 'Rua B, 200'
      },
    ],
    createTeacher: jest.fn(),
    updateTeacher: jest.fn(),
    deleteTeacher: jest.fn(),
    getTeacherById: jest.fn(),
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <TeachersContext.Provider value={mockContext}>
      {children}
    </TeachersContext.Provider>
  );

  it('retorna o contexto corretamente quando usado dentro do provider', () => {
    const { result } = renderHook(() => useTeachers(), { wrapper });
    expect(result.current).toEqual(mockContext);
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useTeachers())).toThrow(
      'useTeachers deve ser usado dentro de um TeachersProvider'
    );
  });
});
