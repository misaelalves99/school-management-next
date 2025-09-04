// src/app/enrollments/edit/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditEnrollmentPage from './page';
import * as nextNavigation from 'next/navigation';
import mockEnrollments from '../../../mocks/enrollments';
import { useEnrollments } from '../../../hooks/useEnrollments';
import { useStudents } from '../../../hooks/useStudents';
import { useClassRooms } from '../../../hooks/useClassRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../../hooks/useEnrollments');
jest.mock('../../../hooks/useStudents');
jest.mock('../../../hooks/useClassRooms');

describe('EditEnrollmentPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    mockEnrollments.length = 0;
    mockEnrollments.push({
      id: 1,
      studentId: 1,
      classRoomId: 1,
      enrollmentDate: '2025-01-01',
      status: 'Ativo',
    });

    (useEnrollments as jest.Mock).mockReturnValue({
      enrollments: mockEnrollments,
      updateEnrollment: jest.fn((updated) => {
        const index = mockEnrollments.findIndex(e => e.id === updated.id);
        if (index !== -1) mockEnrollments[index] = { ...updated };
      }),
    });

    (useStudents as jest.Mock).mockReturnValue({
      students: [
        { id: 1, name: 'Aluno 1' },
        { id: 2, name: 'Aluno 2' },
      ],
    });

    (useClassRooms as jest.Mock).mockReturnValue({
      classRooms: [
        { id: 1, name: 'Sala 1' },
        { id: 2, name: 'Sala 2' },
        { id: 3, name: 'Sala 3' },
      ],
    });
  });

  it('mostra "Carregando matrícula..." se formData ainda não está carregado', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: undefined });
    render(<EditEnrollmentPage />);
    expect(screen.getByText('Carregando matrícula...')).toBeInTheDocument();
  });

  it('renderiza os inputs com os valores do mock', async () => {
    render(<EditEnrollmentPage />);
    await waitFor(() => {
      expect(screen.getByLabelText('Aluno')).toHaveValue(1);
      expect(screen.getByLabelText('Turma')).toHaveValue(1);
      expect(screen.getByLabelText('Data da Matrícula')).toHaveValue('2025-01-01');
    });
  });

  it('valida campos obrigatórios e mostra erros', async () => {
    render(<EditEnrollmentPage />);
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Aluno'), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText('Turma'), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText('Data da Matrícula'), { target: { value: '' } });
      fireEvent.click(screen.getByText('Salvar Alterações'));

      expect(screen.getByText('Aluno é obrigatório.')).toBeInTheDocument();
      expect(screen.getByText('Turma é obrigatória.')).toBeInTheDocument();
      expect(screen.getByText('Data da matrícula é obrigatória.')).toBeInTheDocument();
    });
  });

  it('atualiza o mock e chama router.push ao salvar alterações válidas', async () => {
    render(<EditEnrollmentPage />);
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Aluno'), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText('Turma'), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText('Data da Matrícula'), { target: { value: '2025-02-01' } });

      fireEvent.click(screen.getByText('Salvar Alterações'));
    });

    await waitFor(() => {
      const updated = mockEnrollments.find(e => e.id === 1);
      expect(updated).toMatchObject({ studentId: 2, classRoomId: 3, enrollmentDate: '2025-02-01' });
      expect(pushMock).toHaveBeenCalledWith('/enrollments');
    });
  });

  it('botão Voltar chama router.push("/enrollments")', async () => {
    render(<EditEnrollmentPage />);
    fireEvent.click(screen.getByText('Voltar à Lista'));
    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('alert e redireciona se matrícula não encontrada', async () => {
    window.alert = jest.fn();
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });

    render(<EditEnrollmentPage />);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Matrícula não encontrada');
      expect(pushMock).toHaveBeenCalledWith('/enrollments');
    });
  });
});
