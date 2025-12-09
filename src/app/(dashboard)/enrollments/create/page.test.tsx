// src/app/(dashboard)/enrollments/create/page.test.tsx

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import CreateEnrollmentPage from './page.jsx';
import { useEnrollments } from '@/core/hooks/useEnrollments.js';
import { useStudents } from '@/core/hooks/useStudents.js';
import { useClassRooms } from '@/core/hooks/useClassRooms.js';

jest.mock('@/core/hooks/useEnrollments');
jest.mock('@/core/hooks/useStudents');
jest.mock('@/core/hooks/useClassRooms');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/components/ui/Card', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@/app/components/ui/Button', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/app/components/ui/Badge', () => ({
  __esModule: true,
  default: ({ children }: any) => <span>{children}</span>,
}));

describe('CreateEnrollmentPage (dashboard)', () => {
  const pushMock = jest.fn();
  const addEnrollmentMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    const nextNavigation = require('next/navigation');
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    (useEnrollments as jest.Mock).mockReturnValue({
      addEnrollment: addEnrollmentMock,
    });

    (useStudents as jest.Mock).mockReturnValue({
      students: [
        { id: 1, name: 'João da Silva' },
        { id: 2, name: 'Maria Souza' },
      ],
    });

    (useClassRooms as jest.Mock).mockReturnValue({
      classRooms: [
        { id: 10, name: '1º Ano A' },
        { id: 11, name: '2º Ano B' },
      ],
    });
  });

  it('renderiza títulos e campos principais do formulário', () => {
    render(<CreateEnrollmentPage />);

    expect(screen.getByText('Nova matrícula')).toBeInTheDocument();
    expect(screen.getByLabelText(/Aluno/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Turma/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de matrícula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status da matrícula/i)).toBeInTheDocument();
  });

  it('exibe mensagem de erro ao tentar salvar sem campos obrigatórios', async () => {
    render(<CreateEnrollmentPage />);

    const submitButton = screen.getByRole('button', {
      name: /Salvar matrícula/i,
    });

    fireEvent.click(submitButton);

    expect(
      await screen.findByText('Selecione um aluno.')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Selecione uma turma.')
    ).toBeInTheDocument();
  });

  it('envia os dados corretos ao criar matrícula e redireciona para a lista', async () => {
    addEnrollmentMock.mockResolvedValueOnce(undefined);

    render(<CreateEnrollmentPage />);

    fireEvent.change(screen.getByLabelText(/Aluno/i), {
      target: { value: '1' },
    });

    fireEvent.change(screen.getByLabelText(/Turma/i), {
      target: { value: '10' },
    });

    fireEvent.change(screen.getByLabelText(/Data de matrícula/i), {
      target: { value: '2025-03-01' },
    });

    fireEvent.change(screen.getByLabelText(/Status da matrícula/i), {
      target: { value: 'ACTIVE' },
    });

    const submitButton = screen.getByRole('button', {
      name: /Salvar matrícula/i,
    });
    fireEvent.click(submitButton);

    expect(addEnrollmentMock).toHaveBeenCalledWith({
      studentId: 1,
      classRoomId: 10,
      enrollmentDate: '2025-03-01',
      status: 'ACTIVE',
    });

    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('volta para a lista ao clicar em "Voltar"', () => {
    render(<CreateEnrollmentPage />);

    const backButton = screen.getByRole('button', { name: /Voltar/i });
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });
});
