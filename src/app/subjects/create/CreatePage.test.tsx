// src/app/subjects/create/CreatePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CreateSubjectPage from './page';
import * as nextRouter from 'next/navigation';

describe('CreateSubjectPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();
  });

  it('renderiza título e campos do formulário', () => {
    render(<CreateSubjectPage />);
    expect(screen.getByRole('heading', { name: /cadastrar nova disciplina/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da disciplina/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar à lista/i })).toBeInTheDocument();
  });

  it('mostra erro se o campo nome estiver vazio ao submeter', () => {
    render(<CreateSubjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(screen.getByText(/o nome da disciplina é obrigatório/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submete o formulário corretamente quando nome preenchido', () => {
    render(<CreateSubjectPage />);
    const nameInput = screen.getByLabelText(/nome da disciplina/i);
    fireEvent.change(nameInput, { target: { value: 'Matemática' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(screen.queryByText(/o nome da disciplina é obrigatório/i)).not.toBeInTheDocument();
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Voltar redireciona corretamente', () => {
    render(<CreateSubjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /voltar à lista/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
