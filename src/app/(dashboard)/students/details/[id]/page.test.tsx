// src/app/(dashboard)/students/details/[id]/page.test.tsx

import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import StudentDetailsPage from './page.jsx';

const pushMock = jest.fn();
const getStudentByIdMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useParams: jest.fn(),
}));

jest.mock('@/core/hooks/useStudents', () => ({
  useStudents: () => ({
    getStudentById: getStudentByIdMock,
  }),
}));

jest.mock('@/core/utils/formatDate', () => ({
  formatDate: (value: string) => `formatted-${value}`,
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
  default: ({
    children,
    onClick,
    type = 'button',
    ...props
  }: any) => (
    <button type={type} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/app/components/ui/Badge', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}));

const mockedUseParams = require('next/navigation')
  .useParams as jest.Mock;

describe('StudentDetailsPage (dashboard)', () => {
  beforeEach(() => {
    pushMock.mockClear();
    getStudentByIdMock.mockReset();
  });

  it('mostra skeleton de carregamento inicialmente', () => {
    mockedUseParams.mockReturnValue({ id: '1' });
    getStudentByIdMock.mockReturnValue({
      id: 1,
      name: 'João',
      email: 'joao@escola.com',
      dateOfBirth: '2007-01-01',
      enrollmentNumber: 'ALU-001',
      phone: '123',
      address: 'Rua A, 123',
    });

    render(<StudentDetailsPage />);

    expect(
      screen.getByText(/Carregando aluno/i),
    ).toBeInTheDocument();
  });

  it('mostra tela de não encontrado quando aluno não existe', async () => {
    mockedUseParams.mockReturnValue({ id: '999' });
    getStudentByIdMock.mockReturnValue(undefined);

    render(<StudentDetailsPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Aluno não encontrado/i),
      ).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', {
      name: /Voltar para alunos/i,
    });
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('renderiza dados principais do aluno quando encontrado', async () => {
    mockedUseParams.mockReturnValue({ id: '2' });
    getStudentByIdMock.mockReturnValue({
      id: 2,
      name: 'Maria da Silva',
      email: 'maria@escola.com',
      dateOfBirth: '2008-02-02',
      enrollmentNumber: 'ALU-002',
      phone: '9999-9999',
      address: 'Rua B, 456',
    });

    render(<StudentDetailsPage />);

    expect(
      await screen.findByText('Maria da Silva'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Matrícula ALU-002/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText('maria@escola.com'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('9999-9999'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Rua B, 456'),
    ).toBeInTheDocument();

    // Data formatada
    expect(
      screen.getByText('formatted-2008-02-02'),
    ).toBeInTheDocument();

    // ID interno
    expect(
      screen.getByText('#2'),
    ).toBeInTheDocument();
  });

  it('botão Voltar navega para /students', async () => {
    mockedUseParams.mockReturnValue({ id: '3' });
    getStudentByIdMock.mockReturnValue({
      id: 3,
      name: 'Pedro',
      email: 'pedro@escola.com',
      dateOfBirth: '2007-03-03',
      enrollmentNumber: 'ALU-003',
      phone: '',
      address: '',
    });

    render(<StudentDetailsPage />);

    const backButton = await screen.findByRole('button', {
      name: /^Voltar$/i,
    });

    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('botão Editar aluno navega para rota de edição', async () => {
    mockedUseParams.mockReturnValue({ id: '4' });
    getStudentByIdMock.mockReturnValue({
      id: 4,
      name: 'Ana',
      email: 'ana@escola.com',
      dateOfBirth: '2006-01-01',
      enrollmentNumber: 'ALU-004',
      phone: '',
      address: '',
    });

    render(<StudentDetailsPage />);

    const editButton = await screen.findByRole('button', {
      name: /Editar aluno/i,
    });

    fireEvent.click(editButton);

    expect(pushMock).toHaveBeenCalledWith('/students/edit/4');
  });

  it('mostra placeholders quando campos opcionais estão vazios', async () => {
    mockedUseParams.mockReturnValue({ id: '5' });
    getStudentByIdMock.mockReturnValue({
      id: 5,
      name: 'Laura',
      email: '',
      dateOfBirth: '',
      enrollmentNumber: '',
      phone: '',
      address: '',
    });

    render(<StudentDetailsPage />);

    // Email / telefone
    expect(
      await screen.findByText('E-mail não informado'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Telefone não informado'),
    ).toBeInTheDocument();

    // Endereço
    expect(
      screen.getByText('Não informado'),
    ).toBeInTheDocument();
  });
});
