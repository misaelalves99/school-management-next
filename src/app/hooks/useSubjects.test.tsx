// src/app/hooks/useSubjects.test.tsx

import { renderHook } from '@testing-library/react';
import { useSubjects } from './useSubjects';
import { SubjectsContext, SubjectsContextType } from '../contexts/SubjectsContext';
import { ReactNode } from 'react';

describe('useSubjects', () => {
  // Mock correto do SubjectsContext, incluindo 'description'
  const mockContext: SubjectsContextType = {
    subjects: [
      { id: 1, name: 'Matemática', description: 'Matemática básica' },
      { id: 2, name: 'Português', description: 'Português avançado' },
    ],
    createSubject: jest.fn(),
    updateSubject: jest.fn(),
    deleteSubject: jest.fn(),
    getSubjectById: jest.fn(),
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <SubjectsContext.Provider value={mockContext}>
      {children}
    </SubjectsContext.Provider>
  );

  it('retorna o contexto corretamente quando usado dentro do provider', () => {
    const { result } = renderHook(() => useSubjects(), { wrapper });
    expect(result.current).toEqual(mockContext);
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useSubjects())).toThrow(
      'useSubjects deve ser usado dentro de um SubjectsProvider'
    );
  });
});
