// src/app/teachers/create/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherCreatePage from './page';
import * as nextRouter from 'next/navigation';
import { useTeachers } from '../../hooks/useTeachers';
import { useSubjects } from '../../hooks/useSubjects';
import { mockSubjects } from '../../mocks/subjects';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('../../hooks/useTeachers');
jest.mock('../../hooks/useSubjects');

describe('TeacherCreatePage', () => {
  const pushMock = jest.fn();
  const createTeacherMock = jest.fn();

  beforeEach(() => {
    (nextRouter.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useTeachers as jest.Mock).mockReturnValue({ createTeacher: createTeacherMock });
    (useSubjects as jest.Mock).mockReturnValue({ subjects: mockSubjects });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  it('renderiza corretamente o formulário', () => {
    render(<TeacherCreatePage />);
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/disciplina/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('valida campos obrigatórios e exibe erros', () => {
    render(<TeacherCreatePage />);
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/disciplina é obrigatória/i)).toBeInTheDocument();
  });

  it('valida email inválido', () => {
    render(<TeacherCreatePage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('chama createTeacher e redireciona ao enviar formulário válido', () => {
    render(<TeacherCreatePage />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/disciplina/i), { target: { value: mockSubjects[0].name } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(createTeacherMock).toHaveBeenCalledWith(expect.objectContaining({
      name: 'João',
      email: 'joao@email.com',
      dateOfBirth: '2000-01-01',
      subject: mockSubjects[0].name,
    }));
    expect(window.alert).toHaveBeenCalledWith('Professor cadastrado com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });

  it('botão "Cancelar" redireciona corretamente', () => {
    render(<TeacherCreatePage />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
