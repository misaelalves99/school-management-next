// src/app/(dashboard)/enrollments/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import EnrollmentDeletePage from './page.jsx';
import { useEnrollments } from '@/core/hooks/useEnrollments.js';
import { useStudents } from '@/core/hooks/useStudents.js';
import { useClassRooms } from '@/core/hooks/useClassRooms.js';

jest.mock('@/core/hooks/useEnrollments');
jest.mock('@/core/hooks/useStudents');
jest.mock('@/core/hooks/useClassRooms');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
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

jest.mock('@/core/utils/formatDate', () => ({
  formatDate: (date: string) => `formatted-${date}`,
}));

describe('EnrollmentDeletePage (dashboard)', () => {
  const pushMock = jest.fn();
  const deleteMock = jest.fn();
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  const baseEnrollment = {
    id: 1,
    studentId: 1,
    classRoomId: 10,
    enrollmentDate: '2025-02-10T00:00:00.000Z',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const nextNavigation = require('next/navigation');
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useEnrollments as jest.Mock).mockReturnValue({
      getEnrollmentById: () => baseEnrollment,
      deleteEnrollment: deleteMock,
    });

    (useStudents as jest.Mock).mockReturnValue({
      students: [
        {
          id: 1,
          name: 'João da Silva',
          email: 'joao@example.com',
        },
      ],
    });

    (useClassRooms as jest.Mock).mockReturnValue({
      classRooms: [
        {
          id: 10,
          name: '1º Ano A',
          period: 'Matutino',
          capacity: 30,
        },
      ],
    });
  });

  it('renderiza estado de vazio quando matrícula não é encontrada', () => {
    (useEnrollments as jest.Mock).mockReturnValue({
      getEnrollmentById: () => undefined,
      deleteEnrollment: deleteMock,
    });

    render(<EnrollmentDeletePage />);

    expect(
      screen.getByText(/Matrícula não encontrada/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Ela pode ter sido removida anteriormente/i)
    ).toBeInTheDocument();
  });

  it('renderiza detalhes da matrícula e aviso de exclusão', () => {
    render(<EnrollmentDeletePage />);

    expect(
      screen.getByRole('heading', { name: /Excluir matrícula #1/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/João da Silva/i)).toBeInTheDocument();
    expect(screen.getByText(/1º Ano A/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ativa/i)[0]).toBeInTheDocument();

    expect(
      screen.getByText(/Essa ação é irreversível/i)
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/formatted-2025-02-10T00:00:00.000Z/i)[0]
    ).toBeInTheDocument();
  });

  it('volta para /enrollments ao clicar em "Voltar para matrículas" no empty state', () => {
    (useEnrollments as jest.Mock).mockReturnValue({
      getEnrollmentById: () => undefined,
      deleteEnrollment: deleteMock,
    });

    render(<EnrollmentDeletePage />);

    fireEvent.click(
      screen.getByRole('button', { name: /Voltar para matrículas/i })
    );

    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('volta para /enrollments ao clicar em "Cancelar"', () => {
    render(<EnrollmentDeletePage />);

    fireEvent.click(
      screen.getByRole('button', { name: /Cancelar/i })
    );

    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('chama deleteEnrollment e redireciona ao confirmar exclusão', async () => {
    deleteMock.mockResolvedValueOnce(undefined);

    render(<EnrollmentDeletePage />);

    fireEvent.click(
      screen.getByRole('button', { name: /Confirmar exclusão/i })
    );

    expect(deleteMock).toHaveBeenCalledWith(1);
    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('mostra alerta em caso de erro ao excluir', async () => {
    deleteMock.mockRejectedValueOnce(new Error('erro'));

    render(<EnrollmentDeletePage />);

    fireEvent.click(
      screen.getByRole('button', { name: /Confirmar exclusão/i })
    );

    expect(alertMock).toHaveBeenCalled();
  });
});
