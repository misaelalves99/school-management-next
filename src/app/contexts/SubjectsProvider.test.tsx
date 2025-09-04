// src/app/context/SubjectsProvider.test.tsx

import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { SubjectsProvider } from './SubjectsProvider';
import { SubjectsContext, SubjectsContextType } from './SubjectsContext';

describe('SubjectsProvider', () => {
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
          onClick={() => ctx.createSubject({ name: 'Química', description: 'Estudo da química', workloadHours: 50 })}
        >
          Criar
        </button>
        <button
          onClick={() => {
            const first = ctx.subjects[0];
            if (first) ctx.updateSubject(first.id, { name: 'Matemática Avançada', description: first.description, workloadHours: first.workloadHours });
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
        <div data-testid="getById">
          {ctx.getSubjectById(2)?.name || 'Não encontrado'}
        </div>
      </div>
    );
  }

  it('deve inicializar com subjects padrão', () => {
    render(
      <SubjectsProvider>
        <TestComponent />
      </SubjectsProvider>
    );

    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('Física')).toBeInTheDocument();
  });

  it('deve criar um novo subject', () => {
    render(
      <SubjectsProvider>
        <TestComponent />
      </SubjectsProvider>
    );

    act(() => {
      screen.getByText('Criar').click();
    });

    expect(screen.getByText('Química')).toBeInTheDocument();
  });

  it('deve atualizar o primeiro subject', () => {
    render(
      <SubjectsProvider>
        <TestComponent />
      </SubjectsProvider>
    );

    act(() => {
      screen.getByText('Atualizar').click();
    });

    expect(screen.getByText('Matemática Avançada')).toBeInTheDocument();
  });

  it('deve deletar o primeiro subject', () => {
    render(
      <SubjectsProvider>
        <TestComponent />
      </SubjectsProvider>
    );

    const firstName = 'Matemática';

    act(() => {
      screen.getByText('Deletar').click();
    });

    expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  });

  it('deve retornar subject pelo ID usando getSubjectById', () => {
    render(
      <SubjectsProvider>
        <TestComponent />
      </SubjectsProvider>
    );

    expect(screen.getByTestId('getById').textContent).toBe('Física');
  });
});
