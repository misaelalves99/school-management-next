// src/app/enrollments/create/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CreateEnrollmentPage from './page';
import * as nextNavigation from 'next/navigation';
import studentsMock from '../../mocks/students';
import classRoomsMock from '../../mocks/classRooms';
import enrollmentsMock from '../../mocks/enrollments';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CreateEnrollmentPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    // Limpar o mock de enrollments antes de cada teste
    enrollmentsMock.length = 0;
  });

  it('deve renderizar o formulário corretamente', () => {
    render(<CreateEnrollmentPage />);
    expect(screen.getByText('Nova Matrícula')).toBeInTheDocument();
    expect(screen.getByLabelText('Aluno')).toBeInTheDocument();
    expect(screen.getByLabelText('Turma')).toBeInTheDocument();
    expect(screen.getByLabelText('Data da Matrícula')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Voltar à Lista')).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', () => {
    render(<CreateEnrollmentPage />);
    fireEvent.click(screen.getByText('Salvar'));
    expect(screen.getByText('Aluno é obrigatório.')).toBeInTheDocument();
    expect(screen.getByText('Turma é obrigatória.')).toBeInTheDocument();
  });

  it('deve adicionar uma matrícula e redirecionar ao submeter', () => {
    render(<CreateEnrollmentPage />);

    fireEvent.change(screen.getByLabelText('Aluno'), { target: { value: studentsMock[0].id } });
    fireEvent.change(screen.getByLabelText('Turma'), { target: { value: classRoomsMock[0].id } });
    fireEvent.change(screen.getByLabelText('Data da Matrícula'), { target: { value: '2025-08-22' } });

    fireEvent.click(screen.getByText('Salvar'));

    expect(enrollmentsMock.length).toBe(1);
    expect(enrollmentsMock[0]).toMatchObject({
      studentId: studentsMock[0].id,
      classRoomId: classRoomsMock[0].id,
      enrollmentDate: '2025-08-22',
      status: 'Ativo',
    });

    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('botão Voltar deve redirecionar', () => {
    render(<CreateEnrollmentPage />);
    fireEvent.click(screen.getByText('Voltar à Lista'));
    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });
});
