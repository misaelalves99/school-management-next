// src/app/students/create/CreatePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CreateStudentPage from './page';
import * as nextRouter from 'next/navigation';

describe('CreateStudentPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();
  });

  it('renderiza todos os campos e botões', () => {
    render(<CreateStudentPage />);
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/matrícula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar à lista/i })).toBeInTheDocument();
  });

  it('mostra erros de validação ao submeter campos obrigatórios vazios', () => {
    render(<CreateStudentPage />);
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/matrícula é obrigatória/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submete o formulário corretamente quando os campos obrigatórios são preenchidos', () => {
    render(<CreateStudentPage />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/matrícula/i), { target: { value: '20230001' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.queryByText(/é obrigatório/i)).not.toBeInTheDocument();
    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('botão "Voltar à Lista" navega corretamente', () => {
    render(<CreateStudentPage />);
    fireEvent.click(screen.getByRole('button', { name: /voltar à lista/i }));
    expect(pushMock).toHaveBeenCalledWith('/students');
  });
});
