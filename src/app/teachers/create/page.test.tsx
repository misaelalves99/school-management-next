// src/app/teachers/create/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import TeacherCreate from './page';
import * as teachersMock from '../../mocks/teachers';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TeacherCreate', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente o formulário', () => {
    render(<TeacherCreate />);
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/disciplina/i)).toBeInTheDocument();
    expect(screen.getByText(/salvar/i)).toBeInTheDocument();
    expect(screen.getByText(/voltar à lista/i)).toBeInTheDocument();
  });

  it('valida campos obrigatórios e exibe erros', () => {
    render(<TeacherCreate />);
    fireEvent.click(screen.getByText(/salvar/i));
    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/disciplina é obrigatória/i)).toBeInTheDocument();
  });

  it('valida email inválido', () => {
    render(<TeacherCreate />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByText(/salvar/i));
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('chama createTeacher e redireciona ao enviar formulário válido', () => {
    const createTeacherSpy = jest.spyOn(teachersMock, 'createTeacher');
    render(<TeacherCreate />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/disciplina/i), { target: { value: 'Matemática' } });
    fireEvent.click(screen.getByText(/salvar/i));

    expect(createTeacherSpy).toHaveBeenCalledWith(expect.objectContaining({
      name: 'João',
      email: 'joao@email.com',
      dateOfBirth: '2000-01-01',
      subject: 'Matemática',
    }));
    expect(window.alert).toHaveBeenCalledWith('Professor salvo com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });

  it('botão "Voltar à Lista" redireciona corretamente', () => {
    render(<TeacherCreate />);
    fireEvent.click(screen.getByText(/voltar à lista/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
