// src/app/(dashboard)/subjects/create/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import CreateSubjectPage from './page.jsx';
import { useSubjects } from '@/core/hooks/useSubjects.js';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useSubjects');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CreateSubjectPage (dashboard)', () => {
  const createSubjectMock = jest.fn();
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSubjects as jest.Mock).mockReturnValue({
      createSubject: createSubjectMock,
    });

    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('renderiza título, subtítulo e botões principais', () => {
    render(<CreateSubjectPage />);

    expect(
      screen.getByRole('heading', { name: /Nova disciplina/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Cadastre uma nova disciplina/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Cancelar/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Salvar disciplina/i }),
    ).toBeInTheDocument();
  });

  it('valida campos obrigatórios e exibe mensagens de erro', () => {
    render(<CreateSubjectPage />);

    const submitButton = screen.getByRole('button', {
      name: /Salvar disciplina/i,
    });

    fireEvent.click(submitButton);

    expect(
      screen.getByText(/Nome da disciplina é obrigatório/i),
    ).toBeInTheDocument();
    expect(createSubjectMock).not.toHaveBeenCalled();
  });

  it('valida carga horária inválida', () => {
    render(<CreateSubjectPage />);

    const nameInput = screen.getByLabelText(/Nome da disciplina/i);
    const workloadInput = screen.getByLabelText(/Carga horária \(horas\)/i);
    const submitButton = screen.getByRole('button', {
      name: /Salvar disciplina/i,
    });

    fireEvent.change(nameInput, { target: { value: 'Matemática' } });
    fireEvent.change(workloadInput, { target: { value: '-10' } });
    fireEvent.click(submitButton);

    expect(
      screen.getByText(/Informe uma carga horária válida/i),
    ).toBeInTheDocument();
    expect(createSubjectMock).not.toHaveBeenCalled();
  });

  it('envia formulário corretamente e navega para /subjects', async () => {
    render(<CreateSubjectPage />);

    const nameInput = screen.getByLabelText(/Nome da disciplina/i);
    const workloadInput = screen.getByLabelText(/Carga horária \(horas\)/i);
    const descriptionInput = screen.getByLabelText(/Descrição/i);
    const submitButton = screen.getByRole('button', {
      name: /Salvar disciplina/i,
    });

    fireEvent.change(nameInput, { target: { value: 'Matemática' } });
    fireEvent.change(workloadInput, { target: { value: '80' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Disciplina focada em álgebra e geometria.' },
    });

    fireEvent.click(submitButton);

    expect(createSubjectMock).toHaveBeenCalledWith({
      name: 'Matemática',
      workloadHours: 80,
      description: 'Disciplina focada em álgebra e geometria.',
    });

    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão "Voltar para disciplinas" navega para /subjects', () => {
    render(<CreateSubjectPage />);

    const backLink = screen.getByRole('button', {
      name: /Voltar para disciplinas/i,
    });

    fireEvent.click(backLink);
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão "Cancelar" navega para /subjects', () => {
    render(<CreateSubjectPage />);

    const cancelButton = screen.getByRole('button', {
      name: /Cancelar/i,
    });

    fireEvent.click(cancelButton);
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
