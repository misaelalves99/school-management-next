// src/providers/TeachersProvider.test.tsx

import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { TeachersProvider } from './TeachersProvider';
import { TeachersContext } from '../contexts/TeachersContext';

describe('TeachersProvider', () => {
  function TestComponent() {
    const ctx = useContext(TeachersContext)!;

    return (
      <div>
        <ul data-testid="teacher-list">
          {ctx.teachers.map(t => <li key={t.id}>{t.name}</li>)}
        </ul>

        <button onClick={() => ctx.createTeacher({
          name: 'Novo Professor',
          email: 'novo@prof.com',
          dateOfBirth: '1980-01-01',
          phone: '123456789',
          address: 'Rua Teste, 100',
          subject: 'Matemática'
        })}>Criar</button>

        <button onClick={() => {
          const first = ctx.teachers[0];
          if (first) ctx.updateTeacher(first.id, { ...first, name: 'Professor Atualizado' });
        }}>Atualizar</button>

        <button onClick={() => {
          const first = ctx.teachers[0];
          if (first) ctx.deleteTeacher(first.id);
        }}>Deletar</button>

        <div data-testid="getById">{ctx.getTeacherById(999)?.name || 'Não encontrado'}</div>
      </div>
    );
  }

  it('inicializa com teachers mockados', () => {
    render(<TeachersProvider><TestComponent /></TeachersProvider>);
    expect(screen.getByTestId('teacher-list').children.length).toBeGreaterThan(0);
  });

  it('cria um novo teacher', () => {
    render(<TeachersProvider><TestComponent /></TeachersProvider>);
    act(() => screen.getByText('Criar').click());
    expect(screen.getByText('Novo Professor')).toBeInTheDocument();
  });

  it('atualiza o primeiro teacher', () => {
    render(<TeachersProvider><TestComponent /></TeachersProvider>);
    act(() => screen.getByText('Criar').click());
    act(() => screen.getByText('Atualizar').click());
    expect(screen.getByText('Professor Atualizado')).toBeInTheDocument();
  });

  it('deleta o primeiro teacher', () => {
    render(<TeachersProvider><TestComponent /></TeachersProvider>);
    act(() => screen.getByText('Criar').click());
    act(() => screen.getByText('Deletar').click());
    expect(screen.queryByText('Novo Professor')).not.toBeInTheDocument();
  });

  it('getTeacherById retorna undefined para ID inexistente', () => {
    render(<TeachersProvider><TestComponent /></TeachersProvider>);
    expect(screen.getByTestId('getById').textContent).toBe('Não encontrado');
  });
});
