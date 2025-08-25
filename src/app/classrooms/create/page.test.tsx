// src/app/classrooms/create/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ClassRoomCreate from './page';
import * as nextNavigation from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ClassRoomCreate', () => {
  const pushMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
  });

  it('deve renderizar título e campos do formulário', () => {
    render(<ClassRoomCreate />);

    expect(screen.getByText(/Cadastrar Nova Sala/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Capacidade/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Voltar à Lista/i })).toBeInTheDocument();
  });

  it('deve mostrar erros se o formulário for submetido vazio', () => {
    render(<ClassRoomCreate />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Capacidade/i), { target: { value: 0 } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Capacidade deve ser entre 1 e 100/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('deve chamar router.push ao submeter formulário válido', () => {
    render(<ClassRoomCreate />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Sala 101' } });
    fireEvent.change(screen.getByLabelText(/Capacidade/i), { target: { value: 30 } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('botão de voltar deve chamar router.push', () => {
    render(<ClassRoomCreate />);

    fireEvent.click(screen.getByRole('button', { name: /Voltar à Lista/i }));

    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
