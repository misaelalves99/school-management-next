// src/app/(dashboard)/students/delete/[id]/page.test.tsx

import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import StudentDeletePage from './page.jsx';

const pushMock = jest.fn();
const getStudentByIdMock = jest.fn();
const deleteStudentMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useParams: jest.fn(),
}));

jest.mock('@/core/hooks/useStudents', () => ({
  useStudents: () => ({
    getStudentById: getStudentByIdMock,
    deleteStudent: deleteStudentMock,
  }),
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

describe('StudentDeletePage (dashboard)', () => {
  beforeEach(() => {
    pushMock.mockClear();
    getStudentByIdMock.mockReset();
    deleteStudentMock.mockReset();
  });

  it('mostra skeleton de carregamento inicialmente', () => {
    mockedUseParams.mockReturnValue({ id: '1' });
    getStudentByIdMock.mockReturnValue({
      id: 1,
      name: 'João',
      email: 'joao@escola.com',
      phone: '123',
      address: 'Rua A, 123',
      enrollmentNumber: 'ALU-001',
    });

    render(<StudentDeletePage />);

    expect(
      screen.getByText(/Carregando aluno/i),
    ).toBeInTheDocument();
  });

  it('exibe tela de não encontrado quando aluno não existe', async () => {
    mockedUseParams.mockReturnValue({ id: '999' });
    getStudentByIdMock.mockReturnValue(undefined);

    render(<StudentDeletePage />);

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

  it('renderiza resumo do aluno e texto de confirmação', async () => {
    mockedUseParams.mockReturnValue({ id: '2' });
    getStudentByIdMock.mockReturnValue({
      id: 2,
      name: 'Maria da Silva',
      email: 'maria@escola.com',
      phone: '9999-9999',
      address: 'Rua B, 456',
      enrollmentNumber: 'ALU-002',
    });

    render(<StudentDeletePage />);

    expect(
      await screen.findByText(/Confirmar exclusão do aluno/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Maria da Silva'),
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
  });

  it('botão Cancelar navega para /students', async () => {
    mockedUseParams.mockReturnValue({ id: '3' });
    getStudentByIdMock.mockReturnValue({
      id: 3,
      name: 'Pedro',
      email: 'pedro@escola.com',
      phone: '',
      address: '',
      enrollmentNumber: '',
    });

    render(<StudentDeletePage />);

    const cancelButton = await screen.findByRole('button', {
      name: /Cancelar/i,
    });

    fireEvent.click(cancelButton);

    expect(pushMock).toHaveBeenCalledWith('/students');
    expect(deleteStudentMock).not.toHaveBeenCalled();
  });

  it('confirma exclusão chamando deleteStudent e redirecionando', async () => {
    mockedUseParams.mockReturnValue({ id: '4' });
    getStudentByIdMock.mockReturnValue({
      id: 4,
      name: 'Ana',
      email: 'ana@escola.com',
      phone: '',
      address: '',
      enrollmentNumber: 'ALU-004',
    });

    deleteStudentMock.mockResolvedValue(undefined);

    render(<StudentDeletePage />);

    const confirmButton = await screen.findByRole('button', {
      name: /Excluir aluno/i,
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteStudentMock).toHaveBeenCalledWith(4);
    });

    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('usa placeholders quando campos opcionais estão vazios', async () => {
    mockedUseParams.mockReturnValue({ id: '5' });
    getStudentByIdMock.mockReturnValue({
      id: 5,
      name: 'Laura',
      email: '',
      phone: '',
      address: '',
      enrollmentNumber: '',
    });

    render(<StudentDeletePage />);

    expect(
      await screen.findByText('Laura'),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText('Não informado').length,
    ).toBeGreaterThanOrEqual(3);
  });
});
