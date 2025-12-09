// src/app/(dashboard)/students/page.test.tsx

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import StudentsPage from './page';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const useStudentsMock = jest.fn();

jest.mock('@/core/hooks/useStudents', () => ({
  useStudents: () => useStudentsMock(),
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

const mockStudents = [
  {
    id: 1,
    name: 'Ana Paula',
    email: 'ana@escola.com',
    dateOfBirth: '2007-02-01',
    enrollmentNumber: 'ALU-001',
    phone: '(11) 90000-0001',
    address: 'Rua A, 100',
  },
  {
    id: 2,
    name: 'Bruno Santos',
    email: 'bruno@escola.com',
    dateOfBirth: '2006-05-10',
    enrollmentNumber: 'ALU-002',
    phone: '(11) 90000-0002',
    address: 'Rua B, 200',
  },
];

describe('StudentsPage (dashboard)', () => {
  beforeEach(() => {
    pushMock.mockClear();
    useStudentsMock.mockReset();
  });

  it('renderiza título, métricas e lista de alunos', () => {
    useStudentsMock.mockReturnValue({ students: mockStudents });

    render(<StudentsPage />);

    expect(
      screen.getByRole('heading', { name: /Alunos/i }),
    ).toBeInTheDocument();

    // métricas
    expect(screen.getByText(/Total de alunos/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // lista
    expect(screen.getByText('Ana Paula')).toBeInTheDocument();
    expect(screen.getByText('Bruno Santos')).toBeInTheDocument();
    expect(screen.getByText('ALU-001')).toBeInTheDocument();
    expect(screen.getByText('ALU-002')).toBeInTheDocument();
  });

  it('filtra alunos pelo campo de busca (nome, email ou matrícula)', () => {
    useStudentsMock.mockReturnValue({ students: mockStudents });

    render(<StudentsPage />);

    const input = screen.getByPlaceholderText(
      /Buscar por nome, e-mail ou matrícula/i,
    );

    // filtra por nome
    fireEvent.change(input, { target: { value: 'Ana' } });
    expect(screen.getByText('Ana Paula')).toBeInTheDocument();
    expect(screen.queryByText('Bruno Santos')).not.toBeInTheDocument();

    // filtra por matrícula
    fireEvent.change(input, { target: { value: 'ALU-002' } });
    expect(screen.getByText('Bruno Santos')).toBeInTheDocument();
    expect(screen.queryByText('Ana Paula')).not.toBeInTheDocument();
  });

  it('renderiza mensagem de vazio quando não existem alunos', () => {
    useStudentsMock.mockReturnValue({ students: [] });

    render(<StudentsPage />);

    expect(
      screen.getByText(/Nenhum aluno encontrado/i),
    ).toBeInTheDocument();
  });

  it('navega para criação de aluno ao clicar em "Novo aluno"', () => {
    useStudentsMock.mockReturnValue({ students: mockStudents });

    render(<StudentsPage />);

    const createButton = screen.getByRole('button', {
      name: /Novo aluno/i,
    });

    fireEvent.click(createButton);

    expect(pushMock).toHaveBeenCalledWith('/students/create');
  });

  it('navega para detalhes, edição e exclusão ao clicar nos ícones', () => {
    useStudentsMock.mockReturnValue({ students: mockStudents });

    render(<StudentsPage />);

    const detailsButton = screen.getAllByRole('button', {
      name: /Ver detalhes do aluno/i,
    })[0];
    const editButton = screen.getAllByRole('button', {
      name: /Editar aluno/i,
    })[0];
    const deleteButton = screen.getAllByRole('button', {
      name: /Excluir aluno/i,
    })[0];

    fireEvent.click(detailsButton);
    expect(pushMock).toHaveBeenCalledWith('/students/details/1');

    fireEvent.click(editButton);
    expect(pushMock).toHaveBeenCalledWith('/students/edit/1');

    fireEvent.click(deleteButton);
    expect(pushMock).toHaveBeenCalledWith('/students/delete/1');
  });
});
