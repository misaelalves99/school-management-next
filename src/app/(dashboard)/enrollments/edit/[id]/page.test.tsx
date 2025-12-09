// src/app/(dashboard)/enrollments/edit/[id]/page.test.tsx

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import EditEnrollmentPage from './page.jsx';
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

describe('EditEnrollmentPage (dashboard)', () => {
  const pushMock = jest.fn();
  const updateEnrollmentMock = jest.fn();
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
      updateEnrollment: updateEnrollmentMock.mockResolvedValue(true),
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

  it('exibe estado de carregamento inicialmente', () => {
    // forçamos loading true simulando que o getEnrollmentById ainda não rodou
    (useEnrollments as jest.Mock).mockReturnValueOnce({
      getEnrollmentById: () => baseEnrollment,
      updateEnrollment: updateEnrollmentMock,
    });

    render(<EditEnrollmentPage />);

    expect(
      screen.getByText(/Carregando dados da matrícula/i)
    ).toBeInTheDocument();
  });

  it('renderiza formulário com dados da matrícula', async () => {
    render(<EditEnrollmentPage />);

    expect(await screen.findByLabelText(/Aluno/i)).toBeInTheDocument();

    expect(
      (screen.getByLabelText(/Aluno/i) as HTMLSelectElement).value
    ).toBe('1');
    expect(
      (screen.getByLabelText(/Turma/i) as HTMLSelectElement).value
    ).toBe('10');

    expect(
      (screen.getByLabelText(/Data de matrícula/i) as HTMLInputElement).value
    ).toBe('2025-02-10');

    expect(
      (screen.getByLabelText(/Status da matrícula/i) as HTMLSelectElement).value
    ).toBe('ACTIVE');
  });

  it('mostra mensagem e redireciona se matrícula não for encontrada', async () => {
    const nextNavigation = require('next/navigation');
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });

    (useEnrollments as jest.Mock).mockReturnValue({
      getEnrollmentById: () => undefined,
      updateEnrollment: updateEnrollmentMock,
    });

    render(<EditEnrollmentPage />);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Matrícula não encontrada');
      expect(pushMock).toHaveBeenCalledWith('/enrollments');
    });
  });

  it('valida campos obrigatórios ao tentar salvar', async () => {
    render(<EditEnrollmentPage />);

    fireEvent.change(screen.getByLabelText(/Aluno/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/Turma/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/Data de matrícula/i), {
      target: { value: '' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Salvar alterações/i })
    );

    expect(
      await screen.findByText(/Selecione um aluno/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Selecione uma turma/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Informe uma data de matrícula/i)
    ).toBeInTheDocument();

    expect(updateEnrollmentMock).not.toHaveBeenCalled();
  });

  it('atualiza matrícula e redireciona na submissão bem sucedida', async () => {
    render(<EditEnrollmentPage />);

    fireEvent.change(screen.getByLabelText(/Aluno/i), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText(/Turma/i), {
      target: { value: '11' },
    });
    fireEvent.change(screen.getByLabelText(/Data de matrícula/i), {
      target: { value: '2025-03-05' },
    });
    fireEvent.change(screen.getByLabelText(/Status da matrícula/i), {
      target: { value: 'PENDING' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Salvar alterações/i })
    );

    await waitFor(() => {
      expect(updateEnrollmentMock).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          studentId: 2,
          classRoomId: 11,
          enrollmentDate: '2025-03-05',
          status: 'PENDING',
        })
      );
      expect(alertMock).toHaveBeenCalledWith(
        'Matrícula atualizada com sucesso!'
      );
      expect(pushMock).toHaveBeenCalledWith('/enrollments');
    });
  });

  it('exibe alerta de erro quando updateEnrollment retorna false', async () => {
    (useEnrollments as jest.Mock).mockReturnValue({
      getEnrollmentById: () => baseEnrollment,
      updateEnrollment: jest.fn().mockResolvedValue(false),
    });

    render(<EditEnrollmentPage />);

    fireEvent.click(
      await screen.findByRole('button', { name: /Salvar alterações/i })
    );

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Erro ao atualizar matrícula');
    });
  });

  it('volta para listagem ao clicar no botão "Voltar"', async () => {
    render(<EditEnrollmentPage />);

    fireEvent.click(await screen.findByRole('button', { name: /Voltar/i }));

    expect(pushMock).toHaveBeenCalledWith('/enrollments');
  });
});
