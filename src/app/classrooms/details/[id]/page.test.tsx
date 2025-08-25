// src/app/classrooms/details/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ClassRoomDetailsPage from './page';
import * as nextNavigation from 'next/navigation';
import mockClassRooms from '../../../mocks/classRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('ClassRoomDetailsPage', () => {
  const pushMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;
  const useParamsMock = nextNavigation.useParams as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
  });

  it('deve renderizar mensagem de turma não encontrada se id inválido', () => {
    useParamsMock.mockReturnValue({ id: '999' });
    render(<ClassRoomDetailsPage />);
    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it('deve renderizar detalhes da turma corretamente', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    render(<ClassRoomDetailsPage />);

    expect(screen.getByText(/Detalhes da Turma/i)).toBeInTheDocument();
    expect(screen.getByText(classRoom.name)).toBeInTheDocument();
    expect(screen.getByText(String(classRoom.capacity))).toBeInTheDocument();
    expect(screen.getByText(classRoom.schedule)).toBeInTheDocument();
  });

  it('deve exibir mensagens corretas quando não houver professores ou disciplinas', () => {
    const classRoom = { ...mockClassRooms[0], teachers: [], subjects: [] };
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    render(<ClassRoomDetailsPage />);

    expect(screen.getByText(/Sem disciplinas vinculadas/i)).toBeInTheDocument();
    expect(screen.getByText(/Sem professores vinculados/i)).toBeInTheDocument();
  });

  it('botão Editar deve chamar router.push com a rota correta', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    render(<ClassRoomDetailsPage />);

    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(pushMock).toHaveBeenCalledWith(`/classrooms/edit/${classRoom.id}`);
  });

  it('botão Voltar deve chamar router.push para /classrooms', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    render(<ClassRoomDetailsPage />);

    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }));
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
