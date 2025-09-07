// src/app/students/page.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(screen.getAllByRole('button', { name: /detalhes/i }).length).toBe(3);
    expect(screen.getAllByRole('button', { name: /editar/i }).length).toBe(3);
    expect(screen.getAllByRole('button', { name: /excluir/i }).length).toBe(3);
    expect(screen.getByRole('button', { name: /cadastrar novo aluno/i })).toBeInTheDocument();
  });

  it('botão Cadastrar Novo Aluno navega para /students/create', async () => {
    render(<StudentsPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cadastrar novo aluno/i }));
    expect(pushMock).toHaveBeenCalledWith('/students/create');
  });

  it('botões Detalhes, Editar e Excluir funcionam corretamente', async () => {
    render(<StudentsPage />);
    const user = userEvent.setup();

    await user.click(screen.getAllByRole('button', { name: /detalhes/i })[0]);
    expect(pushMock).toHaveBeenCalledWith('/students/details/1');

    await user.click(screen.getAllByRole('button', { name: /editar/i })[1]);
    expect(pushMock).toHaveBeenCalledWith('/students/edit/2');

    await user.click(screen.getAllByRole('button', { name: /excluir/i })[2]);
    expect(pushMock).toHaveBeenCalledWith('/students/delete/3');
  });

  it('filtra alunos corretamente pelo campo de busca', async () => {
    render(<StudentsPage />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/digite o nome do aluno/i);

    await user.clear(input);
    await user.type(input, 'Maria');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(screen.queryByText(/joão/i)).not.toBeInTheDocument();
    expect(screen.getByText(/maria/i)).toBeInTheDocument();
    expect(screen.queryByText(/pedro/i)).not.toBeInTheDocument();
  });

  it('exibe mensagem "Nenhum aluno encontrado" quando busca não retorna resultados', async () => {
    render(<StudentsPage />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/digite o nome do aluno/i);

    await user.clear(input);
    await user.type(input, 'XYZ');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(screen.getByText(/nenhum aluno encontrado/i)).toBeInTheDocument();
  });

  it('simula paginação corretamente', async () => {
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
    const user = userEvent.setup();

    // Página inicial
    expect(screen.getByText(/página 1 de 3/i)).toBeInTheDocument();

    // Próxima página
    await user.click(screen.getByText(/próxima/i));
    expect(screen.getByText(/página 2 de 3/i)).toBeInTheDocument();

    // Página anterior
    await user.click(screen.getByText(/anterior/i));
    expect(screen.getByText(/página 1 de 3/i)).toBeInTheDocument();
  });
});
