// src/app/(dashboard)/teachers/details/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TeacherDetailsPage from './page';
import { useTeachers } from '@/core/hooks/useTeachers';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useTeachers');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('TeacherDetailsPage (dashboard)', () => {
  const pushMock = jest.fn();

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
    });

    render(<TeacherDetailsPage />);

    expect(
      screen.getByText(/Carregando professor/i),
    ).toBeInTheDocument();
  });

  it('mostra mensagem de ID inválido quando o parâmetro não é numérico', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: 'abc' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: jest.fn(),
    });

    render(<TeacherDetailsPage />);

    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Volte para a lista de professores/i),
    ).toBeInTheDocument();
  });

  it('mostra mensagem de professor não encontrado quando getTeacherById retorna undefined', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '42' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => undefined,
    });

    render(<TeacherDetailsPage />);

    expect(screen.getByText(/Professor não encontrado/i)).toBeInTheDocument();
  });

  it('renderiza os detalhes do professor quando encontrado', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 3,
        name: 'Carlos Silva',
        email: 'carlos@escola.com',
        subject: 'História',
        phone: '1199999-0000',
        address: 'Rua A, 123',
        dateOfBirth: '1985-05-10',
        createdAt: '2024-01-01',
      }),
    });

    render(<TeacherDetailsPage />);

    expect(
      await screen.findByText(/Carlos Silva/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/carlos@escola.com/i)).toBeInTheDocument();
    expect(screen.getByText(/História/i)).toBeInTheDocument();
    expect(screen.getByText(/1199999-0000/i)).toBeInTheDocument();
    expect(screen.getByText(/Rua A, 123/i)).toBeInTheDocument();
  });

  it('botão "Voltar para lista" redireciona para /teachers', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 4,
        name: 'Ana',
        email: 'ana@escola.com',
        subject: 'Matemática',
        phone: '',
        address: '',
        dateOfBirth: '1990-01-01',
        createdAt: '2024-01-01',
      }),
    });

    render(<TeacherDetailsPage />);

    const backButton = await screen.findByRole('button', {
      name: /Voltar para lista/i,
    });
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });

  it('botão "Editar professor" redireciona para /teachers/edit/[id]', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 5,
        name: 'João',
        email: 'joao@escola.com',
        subject: 'Biologia',
        phone: '',
        address: '',
        dateOfBirth: '1992-02-02',
        createdAt: '2024-02-01',
      }),
    });

    render(<TeacherDetailsPage />);

    const editButton = await screen.findByRole('button', {
      name: /Editar professor/i,
    });
    fireEvent.click(editButton);

    expect(pushMock).toHaveBeenCalledWith('/teachers/edit/5');
  });
});
