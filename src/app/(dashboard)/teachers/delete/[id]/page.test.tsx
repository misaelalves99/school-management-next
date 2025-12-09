// src/app/(dashboard)/teachers/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TeacherDeletePage from './page';
import { useTeachers } from '@/core/hooks/useTeachers';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useTeachers');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('TeacherDeletePage (dashboard)', () => {
  const pushMock = jest.fn();
  const removeTeacherMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('exibe estado de loading inicialmente', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => null,
      removeTeacher: removeTeacherMock,
    });

    render(<TeacherDeletePage />);

    expect(screen.getByText(/Carregando dados/i)).toBeInTheDocument();
  });

  it('mostra mensagem de ID inválido quando o parâmetro não é numérico', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: 'abc' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: jest.fn(),
      removeTeacher: removeTeacherMock,
    });

    render(<TeacherDeletePage />);

    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Volte para a lista de professores/i),
    ).toBeInTheDocument();
  });

  it('mostra mensagem de professor não encontrado quando getTeacherById retorna undefined', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '42' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => undefined,
      removeTeacher: removeTeacherMock,
    });

    render(<TeacherDeletePage />);

    expect(
      screen.getByText(/Professor não encontrado/i),
    ).toBeInTheDocument();
  });

  it('renderiza o resumo do professor quando encontrado', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 3,
        name: 'Carlos Silva',
        email: 'carlos@escola.com',
        subject: 'História',
      }),
      removeTeacher: removeTeacherMock,
    });

    render(<TeacherDeletePage />);

    expect(screen.getByText(/Remover professor/i)).toBeInTheDocument();
    expect(screen.getByText(/Carlos Silva/i)).toBeInTheDocument();
    expect(screen.getByText(/carlos@escola.com/i)).toBeInTheDocument();
    expect(screen.getByText(/História/i)).toBeInTheDocument();
  });

  it('botão "Cancelar" redireciona para /teachers', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 4,
        name: 'Ana',
        email: 'ana@escola.com',
        subject: 'Matemática',
      }),
      removeTeacher: removeTeacherMock,
    });

    render(<TeacherDeletePage />);

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(pushMock).toHaveBeenCalledWith('/teachers');
    expect(removeTeacherMock).not.toHaveBeenCalled();
  });

  it('botão "Confirmar exclusão" chama removeTeacher e redireciona para /teachers', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 5,
        name: 'João',
        email: 'joao@escola.com',
        subject: 'Biologia',
      }),
      removeTeacher: removeTeacherMock,
    });

    render(<TeacherDeletePage />);

    const confirmButton = screen.getByRole('button', {
      name: /Confirmar exclusão/i,
    });
    fireEvent.click(confirmButton);

    expect(removeTeacherMock).toHaveBeenCalledWith(5);
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
