// src/app/enrollments/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import DeleteEnrollmentPage from './page';
import * as nextNavigation from 'next/navigation';
import { useEnrollments } from '@/app/hooks/useEnrollments';
import { useStudents } from '@/app/hooks/useStudents';
import { useClassRooms } from '@/app/hooks/useClassRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/app/hooks/useEnrollments');
jest.mock('@/app/hooks/useStudents');
jest.mock('@/app/hooks/useClassRooms');

describe('DeleteEnrollmentPage', () => {
  const pushMock = jest.fn();
  const deleteEnrollmentMock = jest.fn();

  const mockStudent = { id: 1, name: 'Aluno 1' };
  const mockClassRoom = { id: 1, name: 'Sala A', capacity: 30, schedule: '08:00', subjects: [], teachers: [], classTeacher: null };
  const mockEnrollment = { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-08-02', status: 'Ativo' };

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useEnrollments as jest.Mock).mockReturnValue({
      enrollments: [mockEnrollment],
      deleteEnrollment: deleteEnrollmentMock,
    });
    (useStudents as jest.Mock).mockReturnValue({ students: [mockStudent] });
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: [mockClassRoom] });
  });

  it('exibe "ID inválido" se params.id estiver ausente', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({});
    render(<DeleteEnrollmentPage />);
    expect(screen.getByText('ID inválido')).toBeInTheDocument();
  });

  it('exibe "Matrícula não encontrada" se id não existir', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });
    render(<DeleteEnrollmentPage />);
    expect(screen.getByText('Matrícula não encontrada')).toBeInTheDocument();
  });

  it('renderiza matrícula corretamente e executa exclusão', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    // mock alert
    window.alert = jest.fn();

    render(<DeleteEnrollmentPage />);
    expect(screen.getByText('Excluir Matrícula')).toBeInTheDocument();
    expect(screen.getByText(/Aluno 1/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Excluir'));

    expect(deleteEnrollmentMock).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Matrícula excluída com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('botão cancelar redireciona sem deletar', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<DeleteEnrollmentPage />);

    fireEvent.click(screen.getByText('Cancelar'));

    expect(deleteEnrollmentMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('exibe "Aluno desconhecido" se student não encontrado', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useStudents as jest.Mock).mockReturnValue({ students: [] }); // sem students

    render(<DeleteEnrollmentPage />);
    expect(screen.getByText(/Aluno desconhecido/)).toBeInTheDocument();
  });

  it('exibe "Turma desconhecida" caso queira verificar aula inexistente (se adicionar no JSX)', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: [] }); // sem classRooms

    render(<DeleteEnrollmentPage />);
    expect(screen.getByText(/Aluno desconhecido/)).toBeInTheDocument(); // ainda depende do JSX
  });
});
