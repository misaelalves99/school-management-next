// src/hooks/useStudents.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useStudents } from './useStudents';
import { StudentsContext, StudentsContextType } from '../contexts/StudentsContext';
import { ReactNode } from 'react';
import type { Student } from '../types/Student';

describe('useStudents', () => {
  // Mock completo do StudentsContext com tipos corretos
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
    addStudent: jest.fn((student: Omit<Student, 'id'>): Student => {
      const newStudent: Student = { ...student, id: mockContext.students.length + 1 };
      mockContext.students.push(newStudent);
      return newStudent;
    }),
    updateStudent: jest.fn((id: number, updatedStudent: Omit<Student, 'id'>): Student | null => {
      const index = mockContext.students.findIndex((s) => s.id === id);
      if (index !== -1) {
        const updated: Student = { ...mockContext.students[index], ...updatedStudent };
        mockContext.students[index] = updated;
        return updated;
      }
      return null;
    }),
    deleteStudent: jest.fn((id: number): Student | null => {
      const index = mockContext.students.findIndex((s) => s.id === id);
      if (index !== -1) {
        const deleted: Student = mockContext.students.splice(index, 1)[0];
        return deleted;
      }
      return null;
    }),
    getStudentById: jest.fn((id: number): Student | undefined =>
      mockContext.students.find((s) => s.id === id)
    ),
    refreshStudents: jest.fn(),
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

  it('chama addStudent corretamente', () => {
    const { result } = renderHook(() => useStudents(), { wrapper });
    act(() => {
      const newStudent = result.current.addStudent({
        name: 'Aluno 3',
        email: 'aluno3@email.com',
        dateOfBirth: '2002-03-03',
        enrollmentNumber: '20250003',
        phone: '333333333',
        address: 'Rua C, 300',
      });
      expect(newStudent.id).toBeDefined();
    });
    expect(result.current.addStudent).toHaveBeenCalled();
    expect(result.current.students).toHaveLength(3);
    expect(result.current.students[2].name).toBe('Aluno 3');
  });

  it('chama updateStudent corretamente', () => {
    const { result } = renderHook(() => useStudents(), { wrapper });
    act(() => {
      const updated = result.current.updateStudent(1, {
        name: 'Aluno 1 Updated',
        email: 'aluno1@email.com',
        dateOfBirth: '2000-01-01',
        enrollmentNumber: '20250001',
        phone: '111111111',
        address: 'Rua A, 100',
      });
      expect(updated?.name).toBe('Aluno 1 Updated');
    });
    expect(result.current.updateStudent).toHaveBeenCalled();
    expect(result.current.students[0].name).toBe('Aluno 1 Updated');
  });

  it('chama deleteStudent corretamente', () => {
    const { result } = renderHook(() => useStudents(), { wrapper });

    act(() => {
      result.current.deleteStudent(2);
    });

    expect(result.current.deleteStudent).toHaveBeenCalledWith(2);

    const students = result.current.students as Student[];
    expect(students.find((s) => s.id === 2)).toBeUndefined();
  });

  it('chama getStudentById corretamente', () => {
    const { result } = renderHook(() => useStudents(), { wrapper });
    const student = result.current.getStudentById(1);
    expect(result.current.getStudentById).toHaveBeenCalledWith(1);
    expect(student?.name).toBe('Aluno 1 Updated');
  });

  it('chama refreshStudents corretamente', () => {
    const { result } = renderHook(() => useStudents(), { wrapper });
    act(() => result.current.refreshStudents());
    expect(result.current.refreshStudents).toHaveBeenCalled();
  });

  it('lança erro se usado fora do provider', () => {
    expect(() => renderHook(() => useStudents())).toThrow(
      'useStudents deve ser usado dentro de um StudentsProvider'
    );
  });
});
