// src/app/enrollments/details/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnrollmentDetailsPage from './page';
import * as nextNavigation from 'next/navigation';
import { useEnrollments } from '../../../hooks/useEnrollments';
import { useStudents } from '../../../hooks/useStudents';
import { useClassRooms } from '../../../hooks/useClassRooms';
import mockEnrollments from '../../../mocks/enrollments';
import mockStudents from '../../../mocks/students';
import { mockClassRooms } from '../../../mocks/classRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../../hooks/useEnrollments');
jest.mock('../../../hooks/useStudents');
jest.mock('../../../hooks/useClassRooms');

describe('EnrollmentDetailsPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Reset mocks
    mockEnrollments.length = 0;
    mockEnrollments.push({
      id: 1,
      studentId: 1,
      classRoomId: 1,
      enrollmentDate: '2025-01-01',
      status: 'Ativo',
    });

    mockStudents.length = 0;
    mockStudents.push({
      id: 1,
      name: 'Aluno 1',
      email: 'aluno1@email.com',
      dateOfBirth: '2000-01-01',
      enrollmentNumber: '20250001',
      phone: '123456789',
      address: 'Rua Teste, 100',
    });

    mockClassRooms.length = 0;
    mockClassRooms.push({
      id: 1,
      name: 'Sala 1',
      capacity: 20,
      schedule: 'Seg 08:00',
      subjects: [],
      teachers: [],
      classTeacher: null,
    });

    (useEnrollments as jest.Mock).mockReturnValue({ enrollments: mockEnrollments });
    (useStudents as jest.Mock).mockReturnValue({ students: mockStudents });
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: mockClassRooms });
  });

  it('mostra "Carregando matrícula..." inicialmente', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<EnrollmentDetailsPage />);
    expect(screen.getByText('Carregando matrícula...')).toBeInTheDocument();
  });

  it('renderiza detalhes da matrícula corretamente', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<EnrollmentDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('Detalhes da Matrícula')).toBeInTheDocument();
      expect(screen.getByText('Aluno 1')).toBeInTheDocument();
      expect(screen.getByText('Sala 1')).toBeInTheDocument();
      expect(screen.getByText('Ativo')).toBeInTheDocument();
      expect(screen.getByText(new Date('2025-01-01').toLocaleDateString())).toBeInTheDocument();
    });
  });

  it('botão Editar chama router.push com URL correta', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<EnrollmentDetailsPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Editar'));
      expect(pushMock).toHaveBeenCalledWith('/enrollments/edit/1');
    });
  });

  it('botão Voltar chama router.push para /enrollments', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<EnrollmentDetailsPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Voltar'));
      expect(pushMock).toHaveBeenCalledWith('/enrollments');
    });
  });

  it('alerta e redireciona se matrícula não encontrada', async () => {
    window.alert = jest.fn();
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });

    render(<EnrollmentDetailsPage />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Matrícula não encontrada');
      expect(pushMock).toHaveBeenCalledWith('/enrollments');
    });
  });

  it('mostra fallback "Aluno não informado" e "Turma não informada" se dados ausentes', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useStudents as jest.Mock).mockReturnValue({ students: [] });
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: [] });

    render(<EnrollmentDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('Aluno não informado')).toBeInTheDocument();
      expect(screen.getByText('Turma não informada')).toBeInTheDocument();
    });
  });
});
