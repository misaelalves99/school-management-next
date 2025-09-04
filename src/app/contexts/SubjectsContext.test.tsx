// src/contexts/SubjectsContext.test.tsx

import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { SubjectsContext, SubjectsContextType } from './SubjectsContext';
import type { Subject } from '../types/Subject';

const mockSubjects: Subject[] = [
  { id: 1, name: 'Matemática', description: 'Matemática básica' },
  { id: 2, name: 'História', description: 'História mundial' },
];

describe('SubjectsContext', () => {
  // Provider mock para testes
  function SubjectsProviderMock({ children }: { children: React.ReactNode }) {
    const [subjects, setSubjects] = React.useState<Subject[]>([...mockSubjects]);

    const createSubject = (data: Omit<Subject, 'id'>) => {
      const newSubject: Subject = { ...data, id: Date.now() };
      setSubjects((prev) => [...prev, newSubject]);
    };

    const updateSubject = (id: number, data: Omit<Subject, 'id'>) => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data, id } : s))
      );
    };

    const deleteSubject = (id: number) => {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    };

    const getSubjectById = (id: number) => subjects.find((s) => s.id === id);

    const value: SubjectsContextType = {
      subjects,
      createSubject,
      updateSubject,
      deleteSubject,
      getSubjectById,
    };

    return (
      <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>
    );
  }

  function TestComponent() {
    const ctx = useContext(SubjectsContext)!;

    return (
      <div>
        <ul data-testid="subject-list">
          {ctx.subjects.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>

        <button
          onClick={() =>
            ctx.createSubject({ name: 'Novo Subject', description: 'Descrição do novo subject' })
          }
        >
          Criar
        </button>

        <button
          onClick={() => {
            const first = ctx.subjects[0];
            if (first) {
              ctx.updateSubject(first.id, {
                name: 'Subject Atualizado',
                description: 'Descrição atualizada',
              });
            }
          }}
        >
          Atualizar
        </button>

        <button
          onClick={() => {
            const first = ctx.subjects[0];
            if (first) ctx.deleteSubject(first.id);
          }}
        >
          Deletar
        </button>
      </div>
    );
  }

  it('deve inicializar com subjects mock', () => {
    render(
      <SubjectsProviderMock>
        <TestComponent />
      </SubjectsProviderMock>
    );

    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(mockSubjects.length);
    mockSubjects.forEach((s) => expect(screen.getByText(s.name)).toBeInTheDocument());
  });

  it('deve criar um novo subject', () => {
    render(
      <SubjectsProviderMock>
        <TestComponent />
      </SubjectsProviderMock>
    );

    act(() => screen.getByText('Criar').click());

    expect(screen.getByText('Novo Subject')).toBeInTheDocument();
  });

  it('deve atualizar o primeiro subject', () => {
    render(
      <SubjectsProviderMock>
        <TestComponent />
      </SubjectsProviderMock>
    );

    act(() => screen.getByText('Atualizar').click());

    expect(screen.getByText('Subject Atualizado')).toBeInTheDocument();
  });

  it('deve deletar o primeiro subject', () => {
    render(
      <SubjectsProviderMock>
        <TestComponent />
      </SubjectsProviderMock>
    );

    const firstName = mockSubjects[0].name;
    act(() => screen.getByText('Deletar').click());

    expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  });

  it('deve retornar subject pelo ID', () => {
    let foundSubject: Subject | undefined;

    function GetByIdComponent() {
      const ctx = useContext(SubjectsContext)!;
      foundSubject = ctx.getSubjectById(1);
      return null;
    }

    render(
      <SubjectsProviderMock>
        <GetByIdComponent />
      </SubjectsProviderMock>
    );

    expect(foundSubject).toBeDefined();
    expect(foundSubject?.name).toBe('Matemática');
  });
});
