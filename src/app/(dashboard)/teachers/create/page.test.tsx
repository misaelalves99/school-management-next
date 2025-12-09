// src/app/(dashboard)/teachers/create/page.test.tsx

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import CreateTeacherPage from './page.jsx';

const pushMock = jest.fn();
const addTeacherMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@/core/hooks/useTeachers', () => ({
  useTeachers: () => ({
    addTeacher: addTeacherMock,
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

describe('CreateTeacherPage (dashboard)', () => {
  beforeEach(() => {
    pushMock.mockClear();
    addTeacherMock.mockClear();
  });

  it('renderiza título e campos principais do formulário', () => {
    render(<CreateTeacherPage />);

    expect(
      screen.getByRole('heading', { name: /Novo Professor/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Nome completo/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/E-mail/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Telefone/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Disciplina principal/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Data de nascimento/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Endereço completo/i),
    ).toBeInTheDocument();
  });

  it('mostra mensagens de erro quando campos obrigatórios estão vazios', () => {
    render(<CreateTeacherPage />);

    const submitButton = screen.getByRole('button', {
      name: /Salvar professor/i,
    });

    fireEvent.click(submitButton);

    expect(
      screen.getByText(/Nome é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/E-mail é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Disciplina é obrigatória/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Telefone é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Data de nascimento é obrigatória/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Endereço é obrigatório/i),
    ).toBeInTheDocument();

    expect(addTeacherMock).not.toHaveBeenCalled();
  });

  it('envia o formulário com dados válidos e chama addTeacher + redireciona', async () => {
    render(<CreateTeacherPage />);

    fireEvent.change(screen.getByLabelText(/Nome completo/i), {
      target: { value: 'Ana Souza' },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: 'ana@escola.com' },
    });
    fireEvent.change(screen.getByLabelText(/Telefone/i), {
      target: { value: '(11) 99999-0000' },
    });
    fireEvent.change(screen.getByLabelText(/Disciplina principal/i), {
      target: { value: 'Matemática' },
    });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/Endereço completo/i), {
      target: { value: 'Rua A, 123 - Centro' },
    });

    const submitButton = screen.getByRole('button', {
      name: /Salvar professor/i,
    });

    fireEvent.click(submitButton);

    expect(addTeacherMock).toHaveBeenCalledTimes(1);
    expect(addTeacherMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ana Souza',
        email: 'ana@escola.com',
        subject: 'Matemática',
      }),
    );

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });

  it('volta para lista ao clicar no botão de voltar', () => {
    render(<CreateTeacherPage />);

    const backButton = screen.getByRole('button', { name: /Voltar/i });
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
