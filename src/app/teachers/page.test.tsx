// src/app/teachers/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TeachersPage from './page';
import * as nextNavigation from 'next/navigation';
import { useTeachers } from '../hooks/useTeachers';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('../hooks/useTeachers');

describe('TeachersPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('renderiza lista de professores', () => {
    const teachers = [
      { id: 1, name: 'João', subject: 'Matemática' },
      { id: 2, name: 'Maria', subject: 'História' },
      { id: 3, name: 'Pedro', subject: 'Física' },
    ];
    (useTeachers as jest.Mock).mockReturnValue({ teachers });

    render(<TeachersPage />);

    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('Pedro')).toBeInTheDocument();
  });

  it('filtra professores pelo nome ou disciplina', () => {
    const teachers = [
      { id: 1, name: 'João', subject: 'Matemática' },
      { id: 2, name: 'Maria', subject: 'História' },
    ];
    (useTeachers as jest.Mock).mockReturnValue({ teachers });

    render(<TeachersPage />);
    const input = screen.getByPlaceholderText(/Digite o nome ou disciplina/i);
    fireEvent.change(input, { target: { value: 'história' } });

    expect(screen.queryByText('João')).not.toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('mostra mensagem quando nenhum professor é encontrado', () => {
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [] });
    render(<TeachersPage />);
    expect(screen.getByText(/Nenhum professor encontrado/i)).toBeInTheDocument();
  });

  it('navega para detalhes, edição e exclusão', () => {
    const teachers = [{ id: 1, name: 'João', subject: 'Matemática' }];
    (useTeachers as jest.Mock).mockReturnValue({ teachers });

    render(<TeachersPage />);

    fireEvent.click(screen.getByText(/Detalhes/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers/details/1');

    fireEvent.click(screen.getByText(/Editar/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers/edit/1');

    fireEvent.click(screen.getByText(/Excluir/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers/delete/1');
  });

  it('botão de cadastro navega corretamente', () => {
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [] });
    render(<TeachersPage />);

    fireEvent.click(screen.getByText(/Cadastrar Novo Professor/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers/create');
  });
});
