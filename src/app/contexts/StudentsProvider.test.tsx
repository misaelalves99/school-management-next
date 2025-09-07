// src/providers/StudentsProvider.test.tsx

import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { StudentsProvider } from './StudentsProvider';
import { StudentsContext } from '../contexts/StudentsContext';
import type { Student } from '../types/Student';
import mockStudents from '../mocks/students';

describe('StudentsProvider', () => {
  function TestComponent() {
    const ctx = useContext(StudentsContext)!;

    return (
      <div>
        <ul data-testid="student-list">
          {ctx.students.map((s) => <li key={s.id}>{s.name}</li>)}
        </ul>

        <button onClick={() => ctx.addStudent({ name: 'Novo Aluno', email: 'novo@email.com', dateOfBirth: '2000-01-01', enrollmentNumber: 'ENR999', phone: '999999999', address: 'Rua Novo, 999' })}>Adicionar</button>

        <button onClick={() => {
          const first = ctx.students[0];
          if (first && first.id != null) ctx.updateStudent(first.id, { ...first, name: 'Aluno Atualizado' });
        }}>Atualizar</button>

        <button onClick={() => {
          const first = ctx.students[0];
          if (first && first.id != null) ctx.deleteStudent(first.id);
        }}>Deletar</button>

        <button onClick={() => ctx.refreshStudents()}>Refresh</button>
      </div>
    );
  }

  it('deve inicializar com alunos mock', () => {
    render(<StudentsProvider><TestComponent /></StudentsProvider>);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(mockStudents.length);
    mockStudents.forEach(s => expect(screen.getByText(s.name)).toBeInTheDocument());
  });

  it('deve adicionar um novo aluno', () => {
    render(<StudentsProvider><TestComponent /></StudentsProvider>);
    act(() => screen.getByText('Adicionar').click());
    expect(screen.getByText('Novo Aluno')).toBeInTheDocument();
  });

  it('deve atualizar o primeiro aluno', () => {
    render(<StudentsProvider><TestComponent /></StudentsProvider>);
    act(() => screen.getByText('Atualizar').click());
    expect(screen.getByText('Aluno Atualizado')).toBeInTheDocument();
  });

  it('deve deletar o primeiro aluno', () => {
    render(<StudentsProvider><TestComponent /></StudentsProvider>);
    const firstName = mockStudents[0].name;
    act(() => screen.getByText('Deletar').click());
    expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  });

  it('deve retornar aluno pelo ID', () => {
    let foundStudent: Student | undefined;
    render(
      <StudentsProvider>
        <StudentsContext.Consumer>
          {(ctx) => {
            foundStudent = ctx?.getStudentById(mockStudents[0].id!);
            return null;
          }}
        </StudentsContext.Consumer>
      </StudentsProvider>
    );
    expect(foundStudent).toBeDefined();
    expect(foundStudent?.name).toBe(mockStudents[0].name);
  });

  it('deve refresh a lista de alunos', () => {
    render(<StudentsProvider><TestComponent /></StudentsProvider>);
    act(() => screen.getByText('Refresh').click());
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(mockStudents.length);
  });
});
