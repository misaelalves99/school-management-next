// src/app/hooks/useEnrollments.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useEnrollments } from './useEnrollments';
import { EnrollmentsContext, EnrollmentsContextType } from '../contexts/EnrollmentsContext';
import { ReactNode } from 'react';

describe('useEnrollments', () => {
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
    addEnrollment: jest.fn((enrollment) => {
      // Gera id automaticamente
      const newEnrollment = { ...enrollment, id: mockContext.enrollments.length + 1 };
      mockContext.enrollments.push(newEnrollment);
      return newEnrollment;
    }),
    updateEnrollment: jest.fn((enrollment) => {
      const index = mockContext.enrollments.findIndex((e) => e.id === enrollment.id);
      if (index !== -1) mockContext.enrollments[index] = enrollment;
    }),
    deleteEnrollment: jest.fn((id) => {
      const index = mockContext.enrollments.findIndex((e) => e.id === id);
      if (index !== -1) mockContext.enrollments.splice(index, 1);
    }),
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

  it('chama addEnrollment corretamente', () => {
    const { result } = renderHook(() => useEnrollments(), { wrapper });
    act(() => {
      result.current.addEnrollment({
        studentId: 3,
        classRoomId: 3,
        enrollmentDate: '2025-03-01',
        status: 'Ativo',
        studentName: 'Aluno 3',
        classRoomName: 'Sala 3',
        id: 3,
      });
    });
    expect(result.current.addEnrollment).toHaveBeenCalled();
    expect(result.current.enrollments).toHaveLength(3);
    expect(result.current.enrollments[2].studentName).toBe('Aluno 3');
  });

  it('chama updateEnrollment corretamente', () => {
    const { result } = renderHook(() => useEnrollments(), { wrapper });
    act(() => {
      result.current.updateEnrollment({
        id: 1,
        studentId: 1,
        classRoomId: 1,
        enrollmentDate: '2025-01-15',
        status: 'Inativo',
        studentName: 'Aluno 1',
        classRoomName: 'Sala 1',
      });
    });
    expect(result.current.updateEnrollment).toHaveBeenCalled();
    expect(result.current.enrollments[0].status).toBe('Inativo');
    expect(result.current.enrollments[0].enrollmentDate).toBe('2025-01-15');
  });

  it('chama deleteEnrollment corretamente', () => {
    const { result } = renderHook(() => useEnrollments(), { wrapper });
    act(() => {
      result.current.deleteEnrollment(2);
    });
    expect(result.current.deleteEnrollment).toHaveBeenCalled();
    expect(result.current.enrollments.find(e => e.id === 2)).toBeUndefined();
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useEnrollments())).toThrow(
      'useEnrollments deve ser usado dentro de EnrollmentsProvider'
    );
  });
});
