// src/app/classrooms/[id]/edit/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditClassRoomPage from './page';
import * as nextNavigation from 'next/navigation';
import mockClassRooms from '../../../mocks/classRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('EditClassRoomPage', () => {
  const pushMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
  });

  it('deve renderizar mensagem de carregando se classRoom não estiver carregada', () => {
    render(<EditClassRoomPage params={{ id: '999' }} />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('deve alertar e redirecionar se classRoom não existir', async () => {
    window.alert = jest.fn();
    render(<EditClassRoomPage params={{ id: '999' }} />);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Sala não encontrada');
      expect(pushMock).toHaveBeenCalledWith('/classrooms');
    });
  });

  it('deve renderizar formulário com dados da sala existente', async () => {
    const classRoom = mockClassRooms[0];
    render(<EditClassRoomPage params={{ id: String(classRoom.id) }} />);

    expect(await screen.findByDisplayValue(classRoom.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(String(classRoom.capacity))).toBeInTheDocument();
  });

  it('deve atualizar os dados do formulário ao mudar os inputs', async () => {
    const classRoom = mockClassRooms[0];
    render(<EditClassRoomPage params={{ id: String(classRoom.id) }} />);

    const nameInput = await screen.findByLabelText(/Nome/i);
    const capacityInput = screen.getByLabelText(/Capacidade/i);

    fireEvent.change(nameInput, { target: { value: 'Nova Sala' } });
    fireEvent.change(capacityInput, { target: { value: '42' } });

    expect(nameInput).toHaveValue('Nova Sala');
    expect(capacityInput).toHaveValue(42);
  });

  it('deve atualizar mockClassRooms e redirecionar ao submeter', async () => {
    const classRoom = { ...mockClassRooms[0] };
    render(<EditClassRoomPage params={{ id: String(classRoom.id) }} />);

    const nameInput = await screen.findByLabelText(/Nome/i);
    fireEvent.change(nameInput, { target: { value: 'Sala Atualizada' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

    expect(mockClassRooms.find(c => c.id === classRoom.id)?.name).toBe('Sala Atualizada');
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('botão Voltar deve chamar router.push para /classrooms', async () => {
    const classRoom = mockClassRooms[0];
    render(<EditClassRoomPage params={{ id: String(classRoom.id) }} />);

    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
