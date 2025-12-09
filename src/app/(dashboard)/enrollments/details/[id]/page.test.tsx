// src/app/(dashboard)/enrollments/details/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import EnrollmentDetailsPage from './page.jsx';
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

describe('EnrollmentDetailsPage (dashboard)', () => {
  const pushMock = jest.fn();
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
    });

    (useStudents as jest.Mock).mockReturnValue({
      students: [
        {
          id: 1,
          name: 'João da Silva',
          email: 'joao@example.com',
          phone: '11 99999-0000',
          document: '123.456.789-00',
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
    });

    render(<EnrollmentDetailsPage />);

    expect(
      screen.getByText(/Matrícula não encontrada/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Nenhuma matrícula com o identificador informado/i)
    ).toBeInTheDocument();
  });

  it('renderiza detalhes da matrícula, aluno e turma', () => {
    render(<EnrollmentDetailsPage />);

    expect(
      screen.getByRole('heading', { name: /Matrícula #1/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/João da Silva/i)).toBeInTheDocument();
    expect(screen.getByText(/1º Ano A/i)).toBeInTheDocument();

    // status badge
    expect(screen.getAllByText(/Ativa/i)[0]).toBeInTheDocument();

    // verifica datas formatadas
    expect(
      screen.getAllByText(/formatted-2025-02-10T00:00:00.000Z/i)[0]
    ).toBeInTheDocument();
  });

  it('redireciona para /enrollments ao clicar em "Voltar para matrículas" no empty state', () => {
    (useEnrollments as jest.Mock).mockReturnValue({
      getEnrollmentById: () => undefined,
    });

    render(<EnrollmentDetailsPage />);

    fireEvent.click(
      screen.getByRole('button', { name: /Voltar para matrículas/i })
    );

    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('redireciona para /enrollments ao clicar em voltar no header', () => {
    render(<EnrollmentDetailsPage />);

    const backButtons = screen.getAllByRole('button');
    const headerBack = backButtons.find((btn) =>
      btn.className.includes('backButton')
    );

    if (!headerBack) {
      throw new Error('Botão de voltar do header não encontrado');
    }

    fireEvent.click(headerBack);
    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });

  it('redireciona para edição ao clicar em "Editar matrícula"', () => {
    render(<EnrollmentDetailsPage />);

    fireEvent.click(
      screen.getByRole('button', { name: /Editar matrícula/i })
    );

    expect(pushMock).toHaveBeenCalledWith('/enrollments/edit/1');
  });

  it('não tenta editar se matrícula estiver indefinida', () => {
    (useEnrollments as jest.Mock).mockReturnValue({
      getEnrollmentById: () => undefined,
    });

    render(<EnrollmentDetailsPage />);

    // no empty state não existe o botão "Editar matrícula"
    expect(
      screen.queryByRole('button', { name: /Editar matrícula/i })
    ).not.toBeInTheDocument();

    expect(alertMock).not.toHaveBeenCalled();
  });
});
