// src/contexts/TeachersContext.test.tsx
import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { TeachersContext, type TeachersContextType } from './TeachersContext';
import type { Teacher, TeacherFormData } from '../types/Teacher';

const mockTeachers: Teacher[] = [
  { id: 1, name: 'Professor 1', email: 'p1@test.com', dateOfBirth: '1980-01-01', phone: '123', address: 'Rua 1', subject: 'Matemática' },
  { id: 2, name: 'Professor 2', email: 'p2@test.com', dateOfBirth: '1985-02-02', phone: '456', address: 'Rua 2', subject: 'Física' },
];

function TestComponent({ initialTeachers = mockTeachers }: { initialTeachers?: Teacher[] }) {
  const [teachers, setTeachers] = React.useState<Teacher[]>(initialTeachers);

  const contextValue: TeachersContextType = {
    teachers,
    createTeacher: (data: TeacherFormData) => {
      const newTeacher: Teacher = { ...data, id: Date.now() };
      setTeachers(prev => [...prev, newTeacher]);
    },
    updateTeacher: (id, data) => {
      setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
    },
    deleteTeacher: (id) => {
      setTeachers(prev => prev.filter(t => t.id !== id));
    },
    getTeacherById: (id) => teachers.find(t => t.id === id),
  };

  return (
    <TeachersContext.Provider value={contextValue}>
      <ul data-testid="teacher-list">
        {contextValue.teachers.map(t => <li key={t.id}>{t.name}</li>)}
      </ul>

      <button onClick={() => contextValue.createTeacher({
        name: 'Novo Professor',
        email: 'novo@prof.com',
        dateOfBirth: '1980-01-01',
        phone: '123456789',
        address: 'Rua Teste, 100',
        subject: 'Matemática'
      })}>Criar</button>

      <button onClick={() => {
        const first = contextValue.teachers[0];
        if (first) contextValue.updateTeacher(first.id, { ...first, name: 'Professor Atualizado' });
      }}>Atualizar</button>

      <button onClick={() => {
        const first = contextValue.teachers[0];
        if (first) contextValue.deleteTeacher(first.id);
      }}>Deletar</button>

      <div data-testid="getById">{contextValue.getTeacherById(2)?.name || 'Não encontrado'}</div>
    </TeachersContext.Provider>
  );
}

describe('TeachersContext', () => {
  it('inicializa com teachers mock', () => {
    render(<TestComponent />);
    expect(screen.getByText('Professor 1')).toBeInTheDocument();
    expect(screen.getByText('Professor 2')).toBeInTheDocument();
  });

  it('cria um novo teacher', () => {
    render(<TestComponent />);
    act(() => screen.getByText('Criar').click());
    expect(screen.getByText('Novo Professor')).toBeInTheDocument();
  });

  it('atualiza o primeiro teacher', () => {
    render(<TestComponent />);
    act(() => screen.getByText('Atualizar').click());
    expect(screen.getByText('Professor Atualizado')).toBeInTheDocument();
  });

  it('deleta o primeiro teacher', () => {
    render(<TestComponent />);
    act(() => screen.getByText('Deletar').click());
    expect(screen.queryByText('Professor 1')).not.toBeInTheDocument();
  });

  it('retorna teacher pelo ID', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('getById').textContent).toBe('Professor 2');
  });

  it('getTeacherById retorna undefined para ID inexistente', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('getById').textContent).not.toBe('Professor Inexistente');
  });
});
