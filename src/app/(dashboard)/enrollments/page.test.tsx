// src/app/(dashboard)/enrollments/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import EnrollmentsPage from './page';
import { useEnrollments } from '@/core/hooks/useEnrollments';
import { useStudents } from '@/core/hooks/useStudents';
import { useClassRooms } from '@/core/hooks/useClassRooms';

jest.mock('@/core/hooks/useEnrollments');
jest.mock('@/core/hooks/useStudents');
jest.mock('@/core/hooks/useClassRooms');

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
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

jest.mock('@/app/components/ui/DataTable', () => ({
  __esModule: true,
  default: ({ columns, data, emptyMessage }: any) => (
    <table data-testid="data-table">
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td>{emptyMessage}</td>
          </tr>
        ) : (
          data.map((row: any, rowIndex: number) => (
            <tr key={rowIndex}>
              {columns.map((col: any) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  ),
}));

jest.mock('@/core/utils/formatDate', () => ({
  formatDate: (date: string) => `formatted-${date}`,
}));

describe('EnrollmentsPage (dashboard)', () => {
  const enrollmentsMock = [
    {
      id: 1,
      studentId: 1,
      classRoomId: 10,
      enrollmentDate: '2025-01-10T00:00:00.000Z',
      status: 'ACTIVE',
    },
    {
      id: 2,
      studentId: 2,
      classRoomId: 11,
      enrollmentDate: '2025-01-11T00:00:00.000Z',
      status: 'PENDING',
    },
    {
      id: 3,
      studentId: 3,
      classRoomId: 10,
      enrollmentDate: '2025-01-12T00:00:00.000Z',
      status: 'CANCELLED',
    },
  ];

  beforeEach(() => {
    (useEnrollments as jest.Mock).mockReturnValue({
      enrollments: enrollmentsMock,
    });

    (useStudents as jest.Mock).mockReturnValue({
      students: [
        { id: 1, name: 'João Ativo' },
        { id: 2, name: 'Maria Pendente' },
        { id: 3, name: 'Carlos Cancelado' },
      ],
    });

    (useClassRooms as jest.Mock).mockReturnValue({
      classRooms: [
        { id: 10, name: '1º Ano A' },
        { id: 11, name: '2º Ano B' },
      ],
    });
  });

  it('renderiza título e estatísticas básicas', () => {
    render(<EnrollmentsPage />);

    expect(screen.getByText(/Matrículas/i)).toBeInTheDocument();
    expect(screen.getByText(/Total de matrículas/i)).toBeInTheDocument();

    // Os valores são renderizados como texto simples
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renderiza linhas de dados na DataTable', () => {
    render(<EnrollmentsPage />);

    expect(screen.getByText(/João Ativo/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria Pendente/i)).toBeInTheDocument();
    expect(screen.getByText(/Carlos Cancelado/i)).toBeInTheDocument();

    expect(
      screen.getAllByText(/formatted-2025-01-10T00:00:00.000Z|formatted-2025-01-11T00:00:00.000Z|formatted-2025-01-12T00:00:00.000Z/i)
    ).toBeTruthy();
  });

  it('filtra por status "Ativas"', () => {
    render(<EnrollmentsPage />);

    const activeButton = screen.getByRole('button', { name: /Ativas/i });
    fireEvent.click(activeButton);

    expect(screen.getByText(/João Ativo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Maria Pendente/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Carlos Cancelado/i)).not.toBeInTheDocument();
  });

  it('filtra por status "Pendentes"', () => {
    render(<EnrollmentsPage />);

    const pendingButton = screen.getByRole('button', { name: /Pendentes/i });
    fireEvent.click(pendingButton);

    expect(screen.getByText(/Maria Pendente/i)).toBeInTheDocument();
    expect(screen.queryByText(/João Ativo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Carlos Cancelado/i)).not.toBeInTheDocument();
  });

  it('filtra por status "Canceladas"', () => {
    render(<EnrollmentsPage />);

    const cancelledButton = screen.getByRole('button', { name: /Canceladas/i });
    fireEvent.click(cancelledButton);

    expect(screen.getByText(/Carlos Cancelado/i)).toBeInTheDocument();
    expect(screen.queryByText(/João Ativo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Maria Pendente/i)).not.toBeInTheDocument();
  });

  it('filtra por termo de busca no nome do aluno', () => {
    render(<EnrollmentsPage />);

    const searchInput = screen.getByPlaceholderText(/Buscar por aluno ou turma/i);
    fireEvent.change(searchInput, { target: { value: 'João' } });

    expect(screen.getByText(/João Ativo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Maria Pendente/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Carlos Cancelado/i)).not.toBeInTheDocument();
  });

  it('exibe mensagem de vazio quando não há resultados', () => {
    render(<EnrollmentsPage />);

    const searchInput = screen.getByPlaceholderText(/Buscar por aluno ou turma/i);
    fireEvent.change(searchInput, { target: { value: 'Zé Ninguém' } });

    expect(
      screen.getByText(/Nenhuma matrícula encontrada com os filtros atuais/i)
    ).toBeInTheDocument();
  });
});
