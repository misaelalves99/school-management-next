// src/app/hooks/useEnrollments.test.tsx

import { renderHook } from '@testing-library/react';
import { useEnrollments } from './useEnrollments';
import { EnrollmentsContext, EnrollmentsContextType } from '../contexts/EnrollmentsContext';
import { ReactNode } from 'react';

describe('useEnrollments', () => {
  // Mock de enrollments completos, com studentName e classRoomName
  const mockContext: EnrollmentsContextType = {
    enrollments: [
      {
        id: 1,
        studentId: 1,
        classRoomId: 1,
        enrollmentDate: '2025-01-01',
        status: 'Ativo',
        studentName: 'Aluno 1',
        classRoomName: 'Sala 1',
      },
      {
        id: 2,
        studentId: 2,
        classRoomId: 2,
        enrollmentDate: '2025-02-01',
        status: 'Inativo',
        studentName: 'Aluno 2',
        classRoomName: 'Sala 2',
      },
    ],
    addEnrollment: jest.fn(),
    updateEnrollment: jest.fn(),
    deleteEnrollment: jest.fn(),
    // getEnrollmentById removido, pois não existe no tipo
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <EnrollmentsContext.Provider value={mockContext}>
      {children}
    </EnrollmentsContext.Provider>
  );

  it('retorna o contexto corretamente quando usado dentro do provider', () => {
    const { result } = renderHook(() => useEnrollments(), { wrapper });
    expect(result.current).toEqual(mockContext);
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useEnrollments())).toThrow(
      'useEnrollments deve ser usado dentro de um EnrollmentsProvider'
    );
  });
});
