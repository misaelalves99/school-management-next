// src/app/(dashboard)/students/edit/[id]/page.test.tsx

import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import StudentEditPage from './page.jsx';

const pushMock = jest.fn();
const getStudentByIdMock = jest.fn();
const updateStudentMock = jest.fn();
const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useParams: jest.fn(),
}));

jest.mock('@/core/hooks/useStudents', () => ({
  useStudents: () => ({
    getStudentById: getStudentByIdMock,
    updateStudent: updateStudentMock,
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
  default: ({ children, onClick, type = 'button', ...props }: any) => (
    <button type={type} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const mockedUseParams = require('next/navigation')
  .useParams as jest.Mock;

describe('StudentEditPage (dashboard)', () => {
  beforeEach(() => {
    pushMock.mockClear();
    getStudentByIdMock.mockReset();
    updateStudentMock.mockReset();
    alertMock.mockClear();
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

    render(<StudentEditPage />);

    expect(
      screen.getByText(/Carregando aluno/i),
    ).toBeInTheDocument();
  });

  it('mostra tela de não encontrado quando aluno não existe', async () => {
    mockedUseParams.mockReturnValue({ id: '999' });
    getStudentByIdMock.mockReturnValue(undefined);

    render(<StudentEditPage />);

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

  it('renderiza formulário preenchido com dados do aluno', async () => {
    mockedUseParams.mockReturnValue({ id: '2' });
    getStudentByIdMock.mockReturnValue({
      id: 2,
      name: 'Maria',
      email: 'maria@escola.com',
      dateOfBirth: '2008-02-02',
      enrollmentNumber: 'ALU-002',
      phone: '999',
      address: 'Rua B, 456',
    });

    render(<StudentEditPage />);

    expect(
      await screen.findByDisplayValue('Maria'),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('maria@escola.com'),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('2008-02-02'),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('ALU-002'),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('999'),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Rua B, 456'),
    ).toBeInTheDocument();
  });

  it('mostra erros de validação ao tentar salvar com campos obrigatórios vazios', async () => {
    mockedUseParams.mockReturnValue({ id: '3' });
    getStudentByIdMock.mockReturnValue({
      id: 3,
      name: '',
      email: '',
      dateOfBirth: '',
      enrollmentNumber: '',
      phone: '',
      address: '',
    });

    render(<StudentEditPage />);

    const submitButton = await screen.findByRole('button', {
      name: /Salvar alterações/i,
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Nome é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/E-mail é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Data de nascimento é obrigatória/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Matrícula é obrigatória/i),
    ).toBeInTheDocument();

    expect(updateStudentMock).not.toHaveBeenCalled();
  });

  it('valida e-mail inválido', async () => {
    mockedUseParams.mockReturnValue({ id: '4' });
    getStudentByIdMock.mockReturnValue({
      id: 4,
      name: 'Pedro',
      email: 'invalido',
      dateOfBirth: '2007-03-03',
      enrollmentNumber: 'ALU-004',
      phone: '',
      address: '',
    });

    render(<StudentEditPage />);

    const submitButton = await screen.findByRole('button', {
      name: /Salvar alterações/i,
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/E-mail inválido/i),
    ).toBeInTheDocument();
    expect(updateStudentMock).not.toHaveBeenCalled();
  });

  it('atualiza aluno com sucesso e redireciona', async () => {
    mockedUseParams.mockReturnValue({ id: '5' });
    getStudentByIdMock.mockReturnValue({
      id: 5,
      name: 'Ana',
      email: 'ana@escola.com',
      dateOfBirth: '2006-01-01',
      enrollmentNumber: 'ALU-005',
      phone: '123',
      address: 'Rua C',
    });
    updateStudentMock.mockReturnValue(true);

    render(<StudentEditPage />);

    const submitButton = await screen.findByRole('button', {
      name: /Salvar alterações/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateStudentMock).toHaveBeenCalledWith(
        5,
        expect.objectContaining({
          name: 'Ana',
          email: 'ana@escola.com',
        }),
      );
      expect(alertMock).toHaveBeenCalledWith(
        'Aluno atualizado com sucesso!',
      );
      expect(pushMock).toHaveBeenCalledWith('/students');
    });
  });

  it('mostra alerta de erro quando updateStudent retorna false', async () => {
    mockedUseParams.mockReturnValue({ id: '6' });
    getStudentByIdMock.mockReturnValue({
      id: 6,
      name: 'Carlos',
      email: 'carlos@escola.com',
      dateOfBirth: '2005-05-05',
      enrollmentNumber: 'ALU-006',
      phone: '999',
      address: 'Rua D',
    });
    updateStudentMock.mockReturnValue(false);

    render(<StudentEditPage />);

    const submitButton = await screen.findByRole('button', {
      name: /Salvar alterações/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        'Erro ao atualizar aluno',
      );
    });
  });

  it('botão Cancelar volta para lista de alunos', async () => {
    mockedUseParams.mockReturnValue({ id: '7' });
    getStudentByIdMock.mockReturnValue({
      id: 7,
      name: 'Laura',
      email: 'laura@escola.com',
      dateOfBirth: '2006-06-06',
      enrollmentNumber: 'ALU-007',
      phone: '',
      address: '',
    });

    render(<StudentEditPage />);

    const cancelButton = await screen.findByRole('button', {
      name: /Cancelar/i,
    });
    fireEvent.click(cancelButton);

    expect(pushMock).toHaveBeenCalledWith('/students');
  });
});
