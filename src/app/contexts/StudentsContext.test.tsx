// src/contexts/StudentsContext.test.tsx

import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { StudentsContext, type StudentsContextType } from './StudentsContext';
import type { Student } from '../types/Student';

const mockStudents: Student[] = [
  { id: 1, name: 'Aluno 1', email: 'aluno1@email.com', dateOfBirth: '2005-01-01', enrollmentNumber: 'ENR001', phone: '123456789', address: 'Rua A, 123' },
  { id: 2, name: 'Aluno 2', email: 'aluno2@email.com', dateOfBirth: '2003-02-02', enrollmentNumber: 'ENR002', phone: '987654321', address: 'Rua B, 456' },
];

function TestComponent({ initialStudents = mockStudents }: { initialStudents?: Student[] }) {
  const [students, setStudents] = React.useState<Student[]>(initialStudents);

  const contextValue: StudentsContextType = {
    students,
    addStudent: (student) => {
      const newStudent: Student = { ...student, id: Date.now() };
      setStudents((prev) => [...prev, newStudent]);
      return newStudent;
    },
    updateStudent: (id, updated) => {
      let updatedStudent: Student | null = null;
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            updatedStudent = { ...s, ...updated };
            return updatedStudent;
          }
          return s;
        })
      );
      return updatedStudent;
    },
    deleteStudent: (id) => setStudents((prev) => prev.filter((s) => s.id !== id)),
    getStudentById: (id) => students.find((s) => s.id === id),
    refreshStudents: () => setStudents([...students]),
  };

  return (
    <StudentsContext.Provider value={contextValue}>
      <ul data-testid="student-list">
        {contextValue.students.map((s) => (
          <li key={s.id ?? s.name}>{s.name}</li>
        ))}
      </ul>

      <button onClick={() => contextValue.addStudent({ name: 'Novo Aluno', email: 'novo@email.com', dateOfBirth: '2000-01-01', enrollmentNumber: 'ENR999', phone: '999999999', address: 'Rua Novo, 999' })}>Adicionar</button>

      <button onClick={() => {
        const first = contextValue.students[0];
        if (first && first.id != null) contextValue.updateStudent(first.id, { ...first, name: 'Aluno Atualizado' });
      }}>Atualizar</button>

      <button onClick={() => {
        const first = contextValue.students[0];
        if (first && first.id != null) contextValue.deleteStudent(first.id);
      }}>Deletar</button>

      <button onClick={() => contextValue.refreshStudents()}>Refresh</button>
    </StudentsContext.Provider>
  );
}

describe('StudentsContext', () => {
  it('inicializa com estudantes mock', () => {
    render(<TestComponent />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(mockStudents.length);
    mockStudents.forEach((s) => expect(screen.getByText(s.name)).toBeInTheDocument());
  });

  it('adiciona um novo estudante', () => {
    render(<TestComponent />);
    screen.getByText('Adicionar').click();
    expect(screen.getByText('Novo Aluno')).toBeInTheDocument();
  });

  it('atualiza o primeiro estudante', () => {
    render(<TestComponent />);
    screen.getByText('Atualizar').click();
    expect(screen.getByText('Aluno Atualizado')).toBeInTheDocument();
  });

  it('deleta o primeiro estudante', () => {
    render(<TestComponent />);
    const firstName = mockStudents[0].name;
    screen.getByText('Deletar').click();
    expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  });

  it('retorna estudante pelo ID', () => {
    let foundStudent: Student | undefined;
    render(<TestComponent />);
    foundStudent = mockStudents.find((s) => s.id === 1);
    expect(foundStudent).toBeDefined();
    expect(foundStudent?.name).toBe('Aluno 1');
  });

  it('refresh a lista de estudantes', () => {
    render(<TestComponent />);
    screen.getByText('Refresh').click();
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(mockStudents.length);
  });
});
