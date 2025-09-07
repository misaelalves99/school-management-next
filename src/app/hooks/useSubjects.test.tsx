// src/app/hooks/useSubjects.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useSubjects } from './useSubjects';
import { SubjectsContext, SubjectsContextType } from '../contexts/SubjectsContext';
import { ReactNode } from 'react';

describe('useSubjects', () => {
  const mockContext: SubjectsContextType = {
    subjects: [
      { id: 1, name: 'Matemática', description: 'Matemática básica' },
      { id: 2, name: 'Português', description: 'Português avançado' },
    ],
    createSubject: jest.fn((subject) => {
      const newSubject = { ...subject, id: mockContext.subjects.length + 1 };
      mockContext.subjects.push(newSubject);
    }),
    updateSubject: jest.fn((id, updatedData) => {
      const index = mockContext.subjects.findIndex((s) => s.id === id);
      if (index !== -1) mockContext.subjects[index] = { id, ...updatedData };
    }),
    deleteSubject: jest.fn((id) => {
      const index = mockContext.subjects.findIndex((s) => s.id === id);
      if (index !== -1) mockContext.subjects.splice(index, 1);
    }),
    getSubjectById: jest.fn((id) => mockContext.subjects.find((s) => s.id === id)),
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

  it('chama createSubject corretamente', () => {
    const { result } = renderHook(() => useSubjects(), { wrapper });
    act(() => {
      result.current.createSubject({ name: 'História', description: 'História moderna' });
    });

    expect(result.current.createSubject).toHaveBeenCalledWith({
      name: 'História',
      description: 'História moderna',
    });

    expect(result.current.subjects).toHaveLength(3);
    expect(result.current.subjects[2].name).toBe('História');
  });

  it('chama updateSubject corretamente', () => {
    const { result } = renderHook(() => useSubjects(), { wrapper });
    act(() => {
      result.current.updateSubject(1, { name: 'Matemática Avançada', description: 'Nível avançado' });
    });

    expect(result.current.updateSubject).toHaveBeenCalledWith(1, {
      name: 'Matemática Avançada',
      description: 'Nível avançado',
    });

    expect(result.current.subjects[0].name).toBe('Matemática Avançada');
  });

  it('chama deleteSubject corretamente', () => {
    const { result } = renderHook(() => useSubjects(), { wrapper });
    act(() => {
      result.current.deleteSubject(2);
    });

    expect(result.current.deleteSubject).toHaveBeenCalledWith(2);
    expect(result.current.subjects.find((s) => s.id === 2)).toBeUndefined();
  });

  it('chama getSubjectById corretamente', () => {
    const { result } = renderHook(() => useSubjects(), { wrapper });
    const subject = result.current.getSubjectById(1);

    expect(result.current.getSubjectById).toHaveBeenCalledWith(1);
    expect(subject?.name).toBe('Matemática Avançada');
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useSubjects())).toThrow(
      'useSubjects deve ser usado dentro de um SubjectsProvider'
    );
  });
});
