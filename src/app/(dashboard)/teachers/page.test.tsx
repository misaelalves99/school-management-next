// src/app/(dashboard)/teachers/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TeachersPage from './page.jsx';
import { useTeachers } from '@/core/hooks/useTeachers.js';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useTeachers');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TeachersPage (dashboard)', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('renderiza título principal, resumo e tabela com professores', () => {
    (useTeachers as jest.Mock).mockReturnValue({
      teachers: [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@example.com',
          subject: 'Matemática',
          dateOfBirth: '1990-01-01',
          phone: '123456',
          address: 'Rua A',
        },
        {
          id: 2,
          name: 'Maria Souza',
          email: 'maria@example.com',
          subject: 'História',
          dateOfBirth: '1992-02-02',
          phone: '654321',
          address: 'Rua B',
        },
      ],
    });

    render(<TeachersPage />);

    expect(
      screen.getByRole('heading', { name: /professores/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/total de professores/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText(/João Silva/)).toBeInTheDocument();
    expect(screen.getByText(/Maria Souza/)).toBeInTheDocument();
    expect(screen.getByText(/Matemática/)).toBeInTheDocument();
    expect(screen.getByText(/História/)).toBeInTheDocument();
  });

  it('filtra professores pelo nome ou disciplina', () => {
    (useTeachers as jest.Mock).mockReturnValue({
      teachers: [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@example.com',
          subject: 'Matemática',
          dateOfBirth: '1990-01-01',
          phone: '123456',
          address: 'Rua A',
        },
        {
          id: 2,
          name: 'Maria Souza',
          email: 'maria@example.com',
          subject: 'História',
          dateOfBirth: '1992-02-02',
          phone: '654321',
          address: 'Rua B',
        },
      ],
    });

    render(<TeachersPage />);

    const input = screen.getByPlaceholderText(/buscar por nome ou disciplina/i);

    // Filtra por nome
    fireEvent.change(input, { target: { value: 'João' } });
    expect(screen.getByText(/João Silva/)).toBeInTheDocument();
    expect(screen.queryByText(/Maria Souza/)).not.toBeInTheDocument();

    // Filtra por disciplina
    fireEvent.change(input, { target: { value: 'História' } });
    expect(screen.getByText(/Maria Souza/)).toBeInTheDocument();
    expect(screen.queryByText(/João Silva/)).not.toBeInTheDocument();
  });

  it('mostra estado vazio quando não há professores', () => {
    (useTeachers as jest.Mock).mockReturnValue({
      teachers: [],
    });

    render(<TeachersPage />);

    expect(
      screen.getByText(/nenhum professor encontrado/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ajuste os filtros de busca/i),
    ).toBeInTheDocument();
  });

  it('navega para criação de novo professor', () => {
    (useTeachers as jest.Mock).mockReturnValue({
      teachers: [],
    });

    render(<TeachersPage />);

    const createButton = screen.getByRole('button', {
      name: /novo professor/i,
    });

    fireEvent.click(createButton);

    expect(pushMock).toHaveBeenCalledWith('/teachers/create');
  });

  it('navega para detalhes, edição e exclusão ao clicar nos botões de ação', () => {
    (useTeachers as jest.Mock).mockReturnValue({
      teachers: [
        {
          id: 10,
          name: 'Carlos Lima',
          email: 'carlos@example.com',
          subject: 'Biologia',
          dateOfBirth: '1985-03-03',
          phone: '999999',
          address: 'Rua C',
        },
      ],
    });

    render(<TeachersPage />);

    const detailsButton = screen.getByRole('button', {
      name: /ver detalhes do professor/i,
    });
    fireEvent.click(detailsButton);
    expect(pushMock).toHaveBeenCalledWith('/teachers/details/10');

    const editButton = screen.getByRole('button', {
      name: /editar professor/i,
    });
    fireEvent.click(editButton);
    expect(pushMock).toHaveBeenCalledWith('/teachers/edit/10');

    const deleteButton = screen.getByRole('button', {
      name: /excluir professor/i,
    });
    fireEvent.click(deleteButton);
    expect(pushMock).toHaveBeenCalledWith('/teachers/delete/10');
  });
});
