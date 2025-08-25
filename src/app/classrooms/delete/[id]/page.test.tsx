// src/app/classrooms/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import DeleteClassRoomPage from './page';
import * as nextNavigation from 'next/navigation';
import mockClassRooms from '../../../mocks/classRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('DeleteClassRoomPage', () => {
  const pushMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;
  const useParamsMock = nextNavigation.useParams as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
  });

  it('deve renderizar mensagem de turma não encontrada se id inválido', () => {
    useParamsMock.mockReturnValue({ id: '999' }); // ID inexistente
    render(<DeleteClassRoomPage />);

    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it('deve renderizar detalhes da turma corretamente', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });

    render(<DeleteClassRoomPage />);

    expect(screen.getByText(/Excluir Turma/i)).toBeInTheDocument();
    expect(screen.getByText(/Tem certeza que deseja excluir/i)).toBeInTheDocument();
    expect(screen.getByText(classRoom.name)).toBeInTheDocument();
    expect(screen.getByText(String(classRoom.capacity))).toBeInTheDocument();
    expect(screen.getByText(classRoom.schedule)).toBeInTheDocument();
  });

  it('botão Confirmar Exclusão deve chamar router.push', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });

    render(<DeleteClassRoomPage />);

    fireEvent.click(screen.getByRole('button', { name: /Confirmar Exclusão/i }));

    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('botão Cancelar deve chamar router.push', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });

    render(<DeleteClassRoomPage />);

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('deve exibir mensagens corretas quando não houver professores ou disciplinas', () => {
    const classRoom = { ...mockClassRooms[0], teachers: [], subjects: [] };
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });

    render(<DeleteClassRoomPage />);

    expect(screen.getByText(/Sem disciplinas vinculadas/i)).toBeInTheDocument();
    expect(screen.getByText(/Sem professores vinculados/i)).toBeInTheDocument();
  });
});
