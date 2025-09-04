// src/hooks/useStudents.test.tsx

import { renderHook } from '@testing-library/react';
import { useStudents } from './useStudents';
import { StudentsContext, StudentsContextType } from '../contexts/StudentsContext';
import { ReactNode } from 'react';

describe('useStudents', () => {
  // Mock completo do StudentsContext
  const mockContext: StudentsContextType = {
    students: [
      {
        id: 1,
        name: 'Aluno 1',
        email: 'aluno1@email.com',
        dateOfBirth: '2000-01-01',
        enrollmentNumber: '20250001',
        phone: '111111111',
        address: 'Rua A, 100',
      },
      {
        id: 2,
        name: 'Aluno 2',
        email: 'aluno2@email.com',
        dateOfBirth: '2001-02-02',
        enrollmentNumber: '20250002',
        phone: '222222222',
        address: 'Rua B, 200',
      },
    ],
    addStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
    getStudentById: jest.fn(),
    refreshStudents: jest.fn(), // ⚠️ agora está incluso
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <StudentsContext.Provider value={mockContext}>
      {children}
    </StudentsContext.Provider>
  );

  it('retorna o contexto corretamente quando usado dentro do provider', () => {
    const { result } = renderHook(() => useStudents(), { wrapper });
    expect(result.current).toEqual(mockContext);
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useStudents())).toThrow(
      'useStudents deve ser usado dentro de um StudentsProvider'
    );
  });
});
