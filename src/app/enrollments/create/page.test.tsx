// src/app/enrollments/create/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CreateEnrollmentPage from './page';
import * as nextNavigation from 'next/navigation';
import studentsMock from '../../mocks/students';
import { mockClassRooms } from '../../mocks/classRooms';
import { useEnrollments } from '../../hooks/useEnrollments';

// Mock do hook de enrollments
jest.mock('../../hooks/useEnrollments');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

describe('CreateEnrollmentPage', () => {
  const pushMock = jest.fn();
  const addEnrollmentMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useEnrollments as jest.Mock).mockReturnValue({
      enrollments: [],
      addEnrollment: addEnrollmentMock,
    });
  });

  it('renderiza o formulário corretamente', () => {
    render(<CreateEnrollmentPage />);
    expect(screen.getByText('Nova Matrícula')).toBeInTheDocument();
    expect(screen.getByLabelText('Aluno')).toBeInTheDocument();
    expect(screen.getByLabelText('Turma')).toBeInTheDocument();
    expect(screen.getByLabelText('Data da Matrícula')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('valida campos obrigatórios', () => {
    render(<CreateEnrollmentPage />);
    fireEvent.click(screen.getByText('Salvar'));
    expect(screen.getByText('Aluno é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Turma é obrigatória.')).toBeInTheDocument();
    expect(screen.queryByText('Data da Matrícula é obrigatória.')).not.toBeInTheDocument(); // data padrão já preenchida
  });

  it('adiciona uma matrícula e redireciona ao submeter', () => {
    render(<CreateEnrollmentPage />);

    // Preenche o formulário
    fireEvent.change(screen.getByLabelText('Aluno'), { target: { value: studentsMock[0].id } });
    fireEvent.change(screen.getByLabelText('Turma'), { target: { value: mockClassRooms[0].id } });
    fireEvent.change(screen.getByLabelText('Data da Matrícula'), { target: { value: '2025-08-22' } });

    fireEvent.click(screen.getByText('Salvar'));

    expect(addEnrollmentMock).toHaveBeenCalledWith(expect.objectContaining({
      studentId: studentsMock[0].id,
      classRoomId: mockClassRooms[0].id,
      studentName: studentsMock[0].name,
      classRoomName: mockClassRooms[0].name,
      enrollmentDate: '2025-08-22',
      status: 'Ativo',
    }));

    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('botão Cancelar redireciona corretamente', () => {
    render(<CreateEnrollmentPage />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('não adiciona matrícula se aluno ou turma não existirem', () => {
    render(<CreateEnrollmentPage />);

    // Simula IDs inválidos
    fireEvent.change(screen.getByLabelText('Aluno'), { target: { value: 9999 } });
    fireEvent.change(screen.getByLabelText('Turma'), { target: { value: 9999 } });

    fireEvent.click(screen.getByText('Salvar'));

    expect(addEnrollmentMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
