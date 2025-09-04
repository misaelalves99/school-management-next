// src/app/subjects/create/CreatePage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CreateSubjectPage from './page';
import * as nextRouter from 'next/navigation';
import * as useSubjectsHook from '../../hooks/useSubjects';

describe('CreateSubjectPage', () => {
  const pushMock = jest.fn();
  const createSubjectMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);

    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      createSubject: createSubjectMock,
      subjects: [],
    } as any);

    pushMock.mockClear();
    createSubjectMock.mockClear();
  });

  it('renderiza título e campos do formulário', () => {
    render(<CreateSubjectPage />);
    expect(screen.getByRole('heading', { name: /cadastrar nova disciplina/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da disciplina/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/carga horária/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('mostra erro se o campo nome estiver vazio ao submeter', () => {
    render(<CreateSubjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(screen.getByText(/o nome da disciplina é obrigatório/i)).toBeInTheDocument();
    expect(createSubjectMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submete o formulário corretamente quando nome preenchido', () => {
    render(<CreateSubjectPage />);
    const nameInput = screen.getByLabelText(/nome da disciplina/i);
    const descInput = screen.getByLabelText(/descrição/i);
    const workloadInput = screen.getByLabelText(/carga horária/i);

    fireEvent.change(nameInput, { target: { value: 'Matemática' } });
    fireEvent.change(descInput, { target: { value: 'Álgebra e Geometria' } });
    fireEvent.change(workloadInput, { target: { value: 80 } });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(createSubjectMock).toHaveBeenCalledWith({
      name: 'Matemática',
      description: 'Álgebra e Geometria',
      workloadHours: 80,
    });
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Cancelar redireciona corretamente', () => {
    render(<CreateSubjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
