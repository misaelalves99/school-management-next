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

    // PAGE_SIZE = 10, então todos aparecem
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

  it('paginação funciona corretamente quando há mais de uma página', () => {
    const teachers = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Professor ${i + 1}`,
      subject: `Disciplina ${i + 1}`,
    }));
    (useTeachers as jest.Mock).mockReturnValue({ teachers });

    render(<TeachersPage />);

    // Página 1: Professores 1-10
    expect(screen.getByText('Professor 1')).toBeInTheDocument();
    expect(screen.getByText('Professor 10')).toBeInTheDocument();
    expect(screen.queryByText('Professor 11')).not.toBeInTheDocument();

    const nextBtn = screen.getByText(/Próxima/i);
    fireEvent.click(nextBtn);

    // Página 2: Professores 11-12
    expect(screen.getByText('Professor 11')).toBeInTheDocument();
    expect(screen.getByText('Professor 12')).toBeInTheDocument();
    expect(screen.queryByText('Professor 1')).not.toBeInTheDocument();

    const prevBtn = screen.getByText(/Anterior/i);
    fireEvent.click(prevBtn);

    // Volta para página 1
    expect(screen.getByText('Professor 1')).toBeInTheDocument();
    expect(screen.queryByText('Professor 11')).not.toBeInTheDocument();
  });
});
