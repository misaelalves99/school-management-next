// src/contexts/TeachersContext.test.tsx
import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { TeachersContext } from './TeachersContext';
import { TeachersProvider } from '../contexts/TeachersProvider';
import type { TeacherFormData } from '../types/Teacher';

describe('TeachersProvider', () => {
  function TestComponent() {
    const ctx = useContext(TeachersContext)!;

    return (
      <div>
        <ul data-testid="teacher-list">
          {ctx.teachers.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>

        <button
          onClick={() =>
            ctx.createTeacher({
              name: 'Novo Professor',
              email: 'novo@prof.com',
              dateOfBirth: '1980-01-01',
              phone: '123456789',
              address: 'Rua Teste, 100',
              subject: 'Matemática', // use o nome correto do campo
            } as TeacherFormData)
          }
        >
          Criar
        </button>

        <button
          onClick={() => {
            const first = ctx.teachers[0];
            if (first)
              ctx.updateTeacher(first.id, {
                name: 'Professor Atualizado',
                email: first.email,
                dateOfBirth: first.dateOfBirth,
                phone: first.phone,
                address: first.address,
                subject: first.subject,
              } as TeacherFormData);
          }}
        >
          Atualizar
        </button>

        <button
          onClick={() => {
            const first = ctx.teachers[0];
            if (first) ctx.deleteTeacher(first.id);
          }}
        >
          Deletar
        </button>

        <div data-testid="getById">{ctx.getTeacherById(1)?.name || 'Não encontrado'}</div>
      </div>
    );
  }

  it('deve inicializar com lista de teachers', () => {
    render(
      <TeachersProvider>
        <TestComponent />
      </TeachersProvider>
    );
    expect(screen.getByTestId('teacher-list')).toBeInTheDocument();
  });

  it('deve criar um novo teacher', () => {
    render(
      <TeachersProvider>
        <TestComponent />
      </TeachersProvider>
    );

    act(() => screen.getByText('Criar').click());

    expect(screen.getByText('Novo Professor')).toBeInTheDocument();
  });

  it('deve atualizar o primeiro teacher', () => {
    render(
      <TeachersProvider>
        <TestComponent />
      </TeachersProvider>
    );

    act(() => screen.getByText('Criar').click());
    act(() => screen.getByText('Atualizar').click());

    expect(screen.getByText('Professor Atualizado')).toBeInTheDocument();
  });

  it('deve deletar o primeiro teacher', () => {
    render(
      <TeachersProvider>
        <TestComponent />
      </TeachersProvider>
    );

    act(() => screen.getByText('Criar').click());
    act(() => screen.getByText('Deletar').click());

    expect(screen.queryByText('Novo Professor')).not.toBeInTheDocument();
  });

  it('deve retornar teacher pelo ID', () => {
    render(
      <TeachersProvider>
        <TestComponent />
      </TeachersProvider>
    );

    act(() => screen.getByText('Criar').click());

    const name = screen.getByTestId('getById').textContent;
    expect(name).toBe('Novo Professor'); // ID 1 será o primeiro criado
  });
});
