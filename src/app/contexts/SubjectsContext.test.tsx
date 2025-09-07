// src/contexts/SubjectsContext.test.tsx

import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { SubjectsContext, type SubjectsContextType } from './SubjectsContext';
import type { Subject } from '../types/Subject';

const mockSubjects: Subject[] = [
  { id: 1, name: 'Matemática', description: 'Matemática básica', workloadHours: 60 },
  { id: 2, name: 'História', description: 'História mundial', workloadHours: 50 },
];

function TestComponent({ initialSubjects = mockSubjects }: { initialSubjects?: Subject[] }) {
  const [subjects, setSubjects] = React.useState<Subject[]>(initialSubjects);

  const contextValue: SubjectsContextType = {
    subjects,
    createSubject: (data) => {
      const newSubject: Subject = { ...data, id: Date.now() };
      setSubjects(prev => [...prev, newSubject]);
    },
    updateSubject: (id, data) => {
      setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
    },
    deleteSubject: (id) => {
      setSubjects(prev => prev.filter(s => s.id !== id));
    },
    getSubjectById: (id) => subjects.find(s => s.id === id),
  };

  return (
    <SubjectsContext.Provider value={contextValue}>
      <ul data-testid="subject-list">
        {contextValue.subjects.map(s => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>

      <button onClick={() => contextValue.createSubject({ name: 'Química', description: 'Estudo da química', workloadHours: 45 })}>
        Criar
      </button>

      <button onClick={() => {
        const first = contextValue.subjects[0];
        if (first) contextValue.updateSubject(first.id, { ...first, name: 'Matemática Avançada' });
      }}>
        Atualizar
      </button>

      <button onClick={() => {
        const first = contextValue.subjects[0];
        if (first) contextValue.deleteSubject(first.id);
      }}>
        Deletar
      </button>

      <div data-testid="getById">
        {contextValue.getSubjectById(2)?.name || 'Não encontrado'}
      </div>
    </SubjectsContext.Provider>
  );
}

describe('SubjectsContext', () => {
  it('inicializa com subjects mock', () => {
    render(<TestComponent />);
    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('História')).toBeInTheDocument();
  });

  it('cria um novo subject', () => {
    render(<TestComponent />);
    act(() => screen.getByText('Criar').click());
    expect(screen.getByText('Química')).toBeInTheDocument();
  });

  it('atualiza o primeiro subject', () => {
    render(<TestComponent />);
    act(() => screen.getByText('Atualizar').click());
    expect(screen.getByText('Matemática Avançada')).toBeInTheDocument();
  });

  it('deleta o primeiro subject', () => {
    render(<TestComponent />);
    const firstName = 'Matemática';
    act(() => screen.getByText('Deletar').click());
    expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  });

  it('retorna subject pelo ID', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('getById').textContent).toBe('História');
  });
});
