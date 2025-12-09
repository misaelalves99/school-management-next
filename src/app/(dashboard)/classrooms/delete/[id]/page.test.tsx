// src/app/(dashboard)/classrooms/delete/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import DeleteClassRoomPage from './page.jsx';
import { useClassRooms } from '@/core/hooks/useClassRooms.js';

jest.mock('@/core/hooks/useClassRooms');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('DeleteClassRoomPage (dashboard)', () => {
  const pushMock = jest.fn();
  const deleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const nextNavigation = require('next/navigation');
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    deleteMock.mockResolvedValue(undefined);
  });

  it('mostra estado de loading inicialmente', () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 1,
        name: '1º Ano A',
        schedule: 'Manhã',
      }),
      deleteClassRoom: deleteMock,
    });

    render(<DeleteClassRoomPage />);
    expect(
      screen.getByText(/Carregando informações da turma/i)
    ).toBeInTheDocument();
  });

  it('renderiza tela de não encontrado quando a turma não existe', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => undefined,
      deleteClassRoom: deleteMock,
    });

    render(<DeleteClassRoomPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Turma não encontrada/i)
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Voltar para turmas/i })
    );
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('exibe dados da turma na tela de confirmação', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 3,
        name: '8º Ano B',
        schedule: 'Tarde',
      }),
      deleteClassRoom: deleteMock,
    });

    render(<DeleteClassRoomPage />);

    expect(await screen.findByText('Remover turma')).toBeInTheDocument();
    expect(screen.getByText('8º Ano B')).toBeInTheDocument();
    expect(screen.getByText('#3')).toBeInTheDocument();
    expect(screen.getByText(/Tarde/)).toBeInTheDocument();
  });

  it('volta para /classrooms ao clicar em Cancelar', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 4,
        name: '6º Ano C',
        schedule: 'Noite',
      }),
      deleteClassRoom: deleteMock,
    });

    render(<DeleteClassRoomPage />);

    const cancelButton = await screen.findByRole('button', {
      name: /Cancelar/i,
    });

    fireEvent.click(cancelButton);
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('chama deleteClassRoom e redireciona ao confirmar remoção', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 5,
        name: '2º Ano D',
        schedule: 'Integral',
      }),
      deleteClassRoom: deleteMock,
    });

    render(<DeleteClassRoomPage />);

    const confirmButton = await screen.findByRole('button', {
      name: /Confirmar remoção/i,
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(5);
      expect(pushMock).toHaveBeenCalledWith('/classrooms');
    });
  });

  it('exibe mensagem de erro quando deleteClassRoom falha', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '6' });

    deleteMock.mockRejectedValueOnce(new Error('Erro qualquer'));

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 6,
        name: '9º Ano E',
        schedule: 'Manhã',
      }),
      deleteClassRoom: deleteMock,
    });

    render(<DeleteClassRoomPage />);

    const confirmButton = await screen.findByRole('button', {
      name: /Confirmar remoção/i,
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Não foi possível remover a turma/i)
      ).toBeInTheDocument();
    });
  });
});
