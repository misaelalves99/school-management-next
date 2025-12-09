// src/app/(dashboard)/teachers/edit/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TeacherEditPage from './page';
import { useTeachers } from '@/core/hooks/useTeachers';
import { useSubjects } from '@/core/hooks/useSubjects';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useTeachers');
jest.mock('@/core/hooks/useSubjects');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('TeacherEditPage (dashboard)', () => {
  const pushMock = jest.fn();
  const updateTeacherMock = jest.fn();
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();

    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    (useSubjects as jest.Mock).mockReturnValue({
      subjects: [
        { id: 1, name: 'Matemática', description: 'Disciplina de Matemática' },
        { id: 2, name: 'História', description: 'Disciplina de História' },
      ],
    });
  });

  it('mostra estado de ID inválido quando o parâmetro não é numérico', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: 'abc' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: jest.fn(),
      updateTeacher: updateTeacherMock,
    });

    render(<TeacherEditPage />);

    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();
    expect(
      screen.getByText(/retorne à lista de professores/i),
    ).toBeInTheDocument();
  });

  it('mostra mensagem de professor não encontrado quando getTeacherById retorna undefined', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '99' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => undefined,
      updateTeacher: updateTeacherMock,
    });

    render(<TeacherEditPage />);

    expect(screen.getByText(/Professor não encontrado/i)).toBeInTheDocument();
  });

  it('renderiza formulário preenchido com dados do professor', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 1,
        name: 'Maria',
        email: 'maria@escola.com',
        subject: 'Matemática',
        phone: '12345',
        address: 'Rua A, 123',
        dateOfBirth: '1990-01-01',
      }),
      updateTeacher: updateTeacherMock,
    });

    render(<TeacherEditPage />);

    expect(await screen.findByDisplayValue('Maria')).toBeInTheDocument();
    expect(screen.getByDisplayValue('maria@escola.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Matemática')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rua A, 123')).toBeInTheDocument();
  });

  it('valida campos obrigatórios e exibe mensagens de erro', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '2' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 2,
        name: '',
        email: '',
        subject: '',
        phone: '',
        address: '',
        dateOfBirth: '',
      }),
      updateTeacher: updateTeacherMock,
    });

    render(<TeacherEditPage />);

    const submitButton = await screen.findByRole('button', {
      name: /salvar alterações/i,
    });

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Data de nascimento é obrigatória/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Disciplina é obrigatória/i),
    ).toBeInTheDocument();

    expect(updateTeacherMock).not.toHaveBeenCalled();
  });

  it('atualiza professor com sucesso e redireciona', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 3,
        name: 'Carlos',
        email: 'carlos@escola.com',
        subject: 'História',
        phone: '99999',
        address: 'Rua B, 321',
        dateOfBirth: '1985-05-10',
      }),
      updateTeacher: updateTeacherMock.mockReturnValue(true),
    });

    render(<TeacherEditPage />);

    const submitButton = await screen.findByRole('button', {
      name: /salvar alterações/i,
    });
    fireEvent.click(submitButton);

    expect(updateTeacherMock).toHaveBeenCalledWith(
      3,
      expect.objectContaining({
        name: 'Carlos',
        email: 'carlos@escola.com',
      }),
    );
    expect(alertSpy).toHaveBeenCalledWith('Professor atualizado com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });

  it('mostra alerta de erro quando updateTeacher retorna false', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 4,
        name: 'João',
        email: 'joao@escola.com',
        subject: 'Matemática',
        phone: '12345',
        address: 'Rua C, 999',
        dateOfBirth: '1992-02-02',
      }),
      updateTeacher: () => false,
    });

    render(<TeacherEditPage />);

    const submitButton = await screen.findByRole('button', {
      name: /salvar alterações/i,
    });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith('Erro ao atualizar professor');
  });

  it('botão "Voltar" navega de volta para /teachers', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 5,
        name: 'Ana',
        email: 'ana@escola.com',
        subject: 'Biologia',
        phone: '77777',
        address: 'Av. Z, 321',
        dateOfBirth: '1993-07-07',
      }),
      updateTeacher: updateTeacherMock,
    });

    render(<TeacherEditPage />);

    const backButton = await screen.findByRole('button', {
      name: /voltar/i,
    });
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
