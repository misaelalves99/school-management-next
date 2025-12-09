// src/app/(dashboard)/classrooms/edit/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ClassRoomEditPage from './page';
import { useClassRooms } from '@/core/hooks/useClassRooms';

jest.mock('@/core/hooks/useClassRooms');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('ClassRoomEditPage (dashboard)', () => {
  const pushMock = jest.fn();
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();

    const nextNavigation = require('next/navigation');
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('exibe o estado de carregamento inicialmente', () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 1,
        name: '1º Ano A',
        schedule: 'Manhã',
        capacity: 30,
      }),
      updateClassRoom: jest.fn(),
    });

    render(<ClassRoomEditPage />);
    expect(screen.getByText(/Carregando turma/i)).toBeInTheDocument();
  });

  it('mostra tela de turma não encontrada quando id é inválido ou inexistente', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => undefined,
      updateClassRoom: jest.fn(),
    });

    render(<ClassRoomEditPage />);

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

  it('renderiza formulário preenchido quando turma existe', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '2' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 2,
        name: '8º Ano B',
        schedule: 'Tarde',
        capacity: 32,
      }),
      updateClassRoom: jest.fn(),
    });

    render(<ClassRoomEditPage />);

    expect(await screen.findByDisplayValue('8º Ano B')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tarde')).toBeInTheDocument();
    expect(screen.getByDisplayValue('32')).toBeInTheDocument();
  });

  it('exibe erros de validação ao tentar salvar com campos obrigatórios vazios', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 3,
        name: '',
        schedule: '',
        capacity: 0,
      }),
      updateClassRoom: jest.fn(),
    });

    render(<ClassRoomEditPage />);

    const submit = await screen.findByRole('button', {
      name: /Salvar alterações/i,
    });

    fireEvent.click(submit);

    expect(
      await screen.findByText(/Nome da turma é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Horário\/turno é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Informe um número de alunos maior que zero/i),
    ).toBeInTheDocument();
  });

  it('atualiza turma com sucesso e redireciona', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });

    const updateMock = jest.fn().mockReturnValue(true);

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 4,
        name: '3º Médio C',
        schedule: 'Manhã',
        capacity: 40,
      }),
      updateClassRoom: updateMock,
    });

    render(<ClassRoomEditPage />);

    const submit = await screen.findByRole('button', {
      name: /Salvar alterações/i,
    });

    fireEvent.click(submit);

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith(
        4,
        expect.objectContaining({
          name: '3º Médio C',
          schedule: 'Manhã',
          capacity: 40,
        }),
      );
      expect(alertMock).toHaveBeenCalledWith('Turma atualizada com sucesso!');
      expect(pushMock).toHaveBeenCalledWith('/classrooms');
    });
  });

  it('exibe alerta de erro quando updateClassRoom retorna false', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 5,
        name: '6º Ano D',
        schedule: 'Integral',
        capacity: 25,
      }),
      updateClassRoom: () => false,
    });

    render(<ClassRoomEditPage />);

    const submit = await screen.findByRole('button', {
      name: /Salvar alterações/i,
    });

    fireEvent.click(submit);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        'Erro ao atualizar turma. Tente novamente.',
      );
    });
  });

  it('volta para listagem ao clicar em "Voltar sem salvar"', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '6' });

    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: () => ({
        id: 6,
        name: '2º Ano E',
        schedule: 'Noite',
        capacity: 28,
      }),
      updateClassRoom: jest.fn(),
    });

    render(<ClassRoomEditPage />);

    const backButton = await screen.findByRole('button', {
      name: /Voltar sem salvar/i,
    });

    fireEvent.click(backButton);
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
