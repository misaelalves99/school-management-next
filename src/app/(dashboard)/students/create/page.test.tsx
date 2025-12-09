// src/app/(dashboard)/students/create/page.test.tsx

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import StudentCreatePage from './page';

const pushMock = jest.fn();
const createStudentMock = jest.fn();
const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@/core/hooks/useStudents', () => ({
  useStudents: () => ({
    createStudent: createStudentMock,
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

describe('StudentCreatePage (dashboard)', () => {
  beforeEach(() => {
    pushMock.mockClear();
    createStudentMock.mockClear();
    alertMock.mockClear();
  });

  it('renderiza título e campos principais do formulário', () => {
    render(<StudentCreatePage />);

    expect(
      screen.getByRole('heading', { name: /Novo aluno/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Nome completo/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Data de nascimento/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Matrícula/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Telefone/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Endereço/i),
    ).toBeInTheDocument();
  });

  it('mostra erros de validação quando campos obrigatórios estão vazios', () => {
    render(<StudentCreatePage />);

    const submitButton = screen.getByRole('button', {
      name: /Salvar aluno/i,
    });

    fireEvent.click(submitButton);

    expect(
      screen.getByText(/Nome é obrigatório/i),
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

    expect(createStudentMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('valida formato de e-mail inválido', () => {
    render(<StudentCreatePage />);

    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: 'email-invalido' },
    });

    const submitButton = screen.getByRole('button', {
      name: /Salvar aluno/i,
    });
    fireEvent.click(submitButton);

    expect(
      screen.getByText(/E-mail inválido/i),
    ).toBeInTheDocument();
    expect(createStudentMock).not.toHaveBeenCalled();
  });

  it('chama createStudent e redireciona ao salvar aluno válido', () => {
    render(<StudentCreatePage />);

    fireEvent.change(screen.getByLabelText(/Nome completo/i), {
      target: { value: 'Ana Paula' },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: 'ana@escola.com' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '2007-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/Matrícula/i), {
      target: { value: 'ALU-001' },
    });
    fireEvent.change(screen.getByLabelText(/Telefone/i), {
      target: { value: '(11) 90000-0000' },
    });
    fireEvent.change(screen.getByLabelText(/Endereço/i), {
      target: { value: 'Rua A, 123' },
    });

    const submitButton = screen.getByRole('button', {
      name: /Salvar aluno/i,
    });
    fireEvent.click(submitButton);

    expect(createStudentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ana Paula',
        email: 'ana@escola.com',
        dateOfBirth: '2007-01-01',
        enrollmentNumber: 'ALU-001',
        phone: '(11) 90000-0000',
        address: 'Rua A, 123',
      }),
    );
    expect(alertMock).toHaveBeenCalledWith('Aluno cadastrado com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('botão de cancelar volta para a lista de alunos', () => {
    render(<StudentCreatePage />);

    const cancelButton = screen.getByRole('button', {
      name: /Cancelar/i,
    });

    fireEvent.click(cancelButton);

    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('link de voltar no header também volta para a lista', () => {
    render(<StudentCreatePage />);

    const backHeaderButton = screen.getByRole('button', {
      name: /Voltar para alunos/i,
    });

    fireEvent.click(backHeaderButton);

    expect(pushMock).toHaveBeenCalledWith('/students');
  });
});
