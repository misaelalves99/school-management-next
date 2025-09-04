// src/app/students/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import StudentsPage from './page';
import * as nextRouter from 'next/navigation';
import * as useStudentsHook from '../hooks/useStudents';

describe('StudentsPage', () => {
  const pushMock = jest.fn();
  const refreshStudentsMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      students: [
        { id: 1, name: 'João', enrollmentNumber: '20230001', phone: '123', address: 'Rua A' },
        { id: 2, name: 'Maria', enrollmentNumber: '20230002', phone: '456', address: 'Rua B' },
        { id: 3, name: 'Pedro', enrollmentNumber: '20230003', phone: '789', address: 'Rua C' },
      ],
      refreshStudents: refreshStudentsMock,
    } as any);

    pushMock.mockClear();
    refreshStudentsMock.mockClear();
  });

  it('renderiza a lista de alunos e botões de ação', () => {
    render(<StudentsPage />);

    expect(screen.getByText(/lista de alunos/i)).toBeInTheDocument();
    expect(screen.getByText(/joão/i)).toBeInTheDocument();
    expect(screen.getByText(/maria/i)).toBeInTheDocument();
    expect(screen.getByText(/pedro/i)).toBeInTheDocument();

    // Botões de ação por aluno
    expect(screen.getAllByRole('button', { name: /detalhes/i }).length).toBe(3);
    expect(screen.getAllByRole('button', { name: /editar/i }).length).toBe(3);
    expect(screen.getAllByRole('button', { name: /excluir/i }).length).toBe(3);

    // Botão de criar novo aluno
    expect(screen.getByRole('button', { name: /cadastrar novo aluno/i })).toBeInTheDocument();
  });

  it('botão Cadastrar Novo Aluno navega para /students/create', () => {
    render(<StudentsPage />);
    fireEvent.click(screen.getByRole('button', { name: /cadastrar novo aluno/i }));
    expect(pushMock).toHaveBeenCalledWith('/students/create');
  });

  it('botões de Detalhes, Editar e Excluir funcionam corretamente', () => {
    render(<StudentsPage />);
    fireEvent.click(screen.getAllByRole('button', { name: /detalhes/i })[0]);
    expect(pushMock).toHaveBeenCalledWith('/students/details/1');

    fireEvent.click(screen.getAllByRole('button', { name: /editar/i })[1]);
    expect(pushMock).toHaveBeenCalledWith('/students/edit/2');

    fireEvent.click(screen.getAllByRole('button', { name: /excluir/i })[2]);
    expect(pushMock).toHaveBeenCalledWith('/students/delete/3');
  });

  it('filtra alunos corretamente pelo campo de busca', () => {
    render(<StudentsPage />);
    const input = screen.getByPlaceholderText(/digite o nome do aluno/i);
    fireEvent.change(input, { target: { value: 'Maria' } });
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(screen.queryByText(/joão/i)).not.toBeInTheDocument();
    expect(screen.getByText(/maria/i)).toBeInTheDocument();
    expect(screen.queryByText(/pedro/i)).not.toBeInTheDocument();
  });

  it('exibe mensagem "Nenhum aluno encontrado" quando busca não retorna resultados', () => {
    render(<StudentsPage />);
    const input = screen.getByPlaceholderText(/digite o nome do aluno/i);
    fireEvent.change(input, { target: { value: 'XYZ' } });
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(screen.getByText(/nenhum aluno encontrado/i)).toBeInTheDocument();
  });

  it('mostra paginação quando há mais de uma página', () => {
    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      students: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Aluno ${i + 1}`,
        enrollmentNumber: `2023${i + 1}`,
        phone: `${i}`,
        address: `Rua ${i}`,
      })),
      refreshStudents: refreshStudentsMock,
    } as any);

    render(<StudentsPage />);
    expect(screen.getByText(/página 1 de 3/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/próxima/i));
    expect(screen.getByText(/página 2 de 3/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/anterior/i));
    expect(screen.getByText(/página 1 de 3/i)).toBeInTheDocument();
  });
});
