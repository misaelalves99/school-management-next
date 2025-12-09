// src/app/(dashboard)/classrooms/details/[id]/page.test.tsx

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ClassRoomDetailsPage from './page.jsx';
import { useClassRooms } from '@/core/hooks/useClassRooms.js';

jest.mock('@/core/hooks/useClassRooms');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('ClassRoomDetailsPage (dashboard)', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const nextNavigation = require('next/navigation');
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('exibe estado de carregamento inicialmente', () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 1,
        name: '1º Ano A',
        schedule: 'Manhã',
        capacity: 30,
      }),
    });

    render(<ClassRoomDetailsPage />);
    expect(
      screen.getByText(/Carregando detalhes da turma/i),
    ).toBeInTheDocument();
  });

  it('mostra tela de não encontrado para id inválido ou turma inexistente', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => undefined,
    });

    render(<ClassRoomDetailsPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Turma não encontrada/i),
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Voltar para lista de turmas/i }),
    );
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('renderiza dados principais da turma quando encontrada', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '2' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 2,
        name: '8º Ano B',
        schedule: 'Tarde',
        capacity: 32,
      }),
    });

    render(<ClassRoomDetailsPage />);

    expect(await screen.findByText('8º Ano B')).toBeInTheDocument();
    expect(screen.getByText(/Tarde/)).toBeInTheDocument();
    expect(screen.getByText(/32 alunos/)).toBeInTheDocument();
    expect(screen.getByText(/#2/)).toBeInTheDocument();
  });

  it('calcula e exibe resumo de lotação para capacidade alta', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 3,
        name: '3º Médio C',
        schedule: 'Integral',
        capacity: 45,
      }),
    });

    render(<ClassRoomDetailsPage />);

    expect(await screen.findByText('3º Médio C')).toBeInTheDocument();
    expect(
      screen.getByText(/Alta capacidade \(turma grande\)/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Lotação alta/i)).toBeInTheDocument();
  });

  it('navega para edição ao clicar em "Editar turma"', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 4,
        name: '6º Ano D',
        schedule: 'Noite',
        capacity: 24,
      }),
    });

    render(<ClassRoomDetailsPage />);

    const editButton = await screen.findByRole('button', {
      name: /Editar turma/i,
    });

    fireEvent.click(editButton);
    expect(pushMock).toHaveBeenCalledWith('/classrooms/edit/4');
  });

  it('volta para listagem ao clicar em "Voltar para listagem"', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 5,
        name: '2º Ano E',
        schedule: 'Manhã',
        capacity: 20,
      }),
    });

    render(<ClassRoomDetailsPage />);

    const backButton = await screen.findByRole('button', {
      name: /Voltar para listagem/i,
    });

    fireEvent.click(backButton);
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
