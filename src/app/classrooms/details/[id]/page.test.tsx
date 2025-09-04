// src/app/classrooms/details/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ClassRoomDetailsPage from './page';
import * as nextNavigation from 'next/navigation';
import { useClassRooms } from '@/app/hooks/useClassRooms';
import { mockClassRooms } from '../../../mocks/classRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/app/hooks/useClassRooms');

describe('ClassRoomDetailsPage', () => {
  const pushMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;
  const useParamsMock = nextNavigation.useParams as jest.Mock;
  const getClassRoomByIdMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: getClassRoomByIdMock,
    });
  });

  it('deve renderizar mensagem de turma não encontrada se id inválido', () => {
    useParamsMock.mockReturnValue({ id: '999' });
    getClassRoomByIdMock.mockReturnValue(undefined);

    render(<ClassRoomDetailsPage />);
    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it('deve renderizar detalhes da turma corretamente', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<ClassRoomDetailsPage />);

    expect(screen.getByText(/Detalhes da Turma/i)).toBeInTheDocument();
    expect(screen.getByText(classRoom.name)).toBeInTheDocument();
    expect(screen.getByText(String(classRoom.capacity))).toBeInTheDocument();
    expect(screen.getByText(classRoom.schedule)).toBeInTheDocument();

    classRoom.subjects.forEach((s) => {
      expect(screen.getByText(s.name)).toBeInTheDocument();
    });

    classRoom.teachers.forEach((t) => {
      expect(screen.getByText(t.name)).toBeInTheDocument();
    });

    expect(
      screen.getByText(classRoom.classTeacher?.name ?? 'Não definido')
    ).toBeInTheDocument();
  });

  it('deve exibir mensagens corretas quando não houver professores ou disciplinas', () => {
    const classRoom = { ...mockClassRooms[0], teachers: [], subjects: [] };
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<ClassRoomDetailsPage />);

    expect(screen.getByText(/Sem disciplinas vinculadas/i)).toBeInTheDocument();
    expect(screen.getByText(/Sem professores vinculados/i)).toBeInTheDocument();
  });

  it('botão Editar deve chamar router.push com a rota correta', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<ClassRoomDetailsPage />);

    fireEvent.click(screen.getByRole('button', { name: /Editar/i }));
    expect(pushMock).toHaveBeenCalledWith(`/classrooms/edit/${classRoom.id}`);
  });

  it('botão Voltar à Lista deve chamar router.push para /classrooms', () => {
    const classRoom = mockClassRooms[0];
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<ClassRoomDetailsPage />);

    fireEvent.click(screen.getByRole('button', { name: /Voltar à Lista/i }));
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
