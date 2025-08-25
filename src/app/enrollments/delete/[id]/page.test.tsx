// src/app/classrooms/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ClassRoomDeletePage from './page';
import * as nextNavigation from 'next/navigation';
import mockClassRooms from '../../../mocks/classRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('ClassRoomDeletePage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    mockClassRooms.length = 3;
    mockClassRooms[0] = { id: 1, name: 'Sala A', capacity: 30, schedule: 'Seg 08:00', subjects: [], teachers: [], classTeacher: null };
    mockClassRooms[1] = { id: 2, name: 'Sala B', capacity: 20, schedule: 'Ter 10:00', subjects: [], teachers: [], classTeacher: null };
    mockClassRooms[2] = { id: 3, name: 'Sala C', capacity: 15, schedule: 'Qua 14:00', subjects: [], teachers: [], classTeacher: null };
  });

  it('deve mostrar mensagem de turma inválida quando id não existe', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({});
    render(<ClassRoomDeletePage />);
    expect(screen.getByText('Turma inválida.')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de turma não encontrada quando id não existe no mock', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });
    render(<ClassRoomDeletePage />);
    expect(screen.getByText('Turma não encontrada.')).toBeInTheDocument();
  });

  it('deve renderizar a turma corretamente e deletar', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<ClassRoomDeletePage />);

    expect(screen.getByText('Excluir Turma')).toBeInTheDocument();
    expect(screen.getByText(/Sala A/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Excluir'));

    expect(mockClassRooms.find(c => c.id === 1)).toBeUndefined();
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('botão cancelar deve redirecionar sem excluir', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '2' });
    render(<ClassRoomDeletePage />);

    fireEvent.click(screen.getByText('Cancelar'));

    expect(mockClassRooms.find(c => c.id === 2)).toBeDefined();
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
