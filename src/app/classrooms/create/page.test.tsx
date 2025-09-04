// src/app/classrooms/create/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ClassRoomCreate from './page';
import * as nextNavigation from 'next/navigation';
import { useClassRooms } from '@/app/hooks/useClassRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/hooks/useClassRooms');

describe('ClassRoomCreate', () => {
  const pushMock = jest.fn();
  const createClassRoomMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
    (useClassRooms as jest.Mock).mockReturnValue({ createClassRoom: createClassRoomMock });
  });

  it('deve renderizar título e campos do formulário', () => {
    render(<ClassRoomCreate />);

    expect(screen.getByText(/Cadastrar Nova Sala/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Capacidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Horário/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  it('deve mostrar erros se o formulário for submetido vazio ou inválido', () => {
    render(<ClassRoomCreate />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Capacidade/i), { target: { value: 0 } });
    fireEvent.change(screen.getByLabelText(/Horário/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Capacidade deve ser entre 1 e 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Horário é obrigatório/i)).toBeInTheDocument();
    expect(createClassRoomMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('deve chamar createClassRoom e router.push ao submeter formulário válido', () => {
    render(<ClassRoomCreate />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Sala 101' } });
    fireEvent.change(screen.getByLabelText(/Capacidade/i), { target: { value: 30 } });
    fireEvent.change(screen.getByLabelText(/Horário/i), { target: { value: 'Seg-Qua 08:00-10:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(createClassRoomMock).toHaveBeenCalledWith({
      name: 'Sala 101',
      capacity: 30,
      schedule: 'Seg-Qua 08:00-10:00',
      subjects: [],
      teachers: [],
      classTeacher: null,
    });
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('botão de cancelar deve chamar router.push', () => {
    render(<ClassRoomCreate />);

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
