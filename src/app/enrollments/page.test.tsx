// src/app/enrollments/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EnrollmentsPage from './page';
import { useEnrollments } from '../hooks/useEnrollments';
import { useStudents } from '../hooks/useStudents';
import { useClassRooms } from '../hooks/useClassRooms';

jest.mock('../hooks/useEnrollments');
jest.mock('../hooks/useStudents');
jest.mock('../hooks/useClassRooms');

describe('EnrollmentsPage', () => {
  const mockEnrollments = [
    { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-01', status: 'Ativo' },
    { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-02-01', status: 'Inativo' },
    { id: 3, studentId: 3, classRoomId: 3, enrollmentDate: '2025-03-01', status: 'Ativo' },
  ];

  const mockStudents = [
    { id: 1, name: 'Aluno 1' },
    { id: 2, name: 'Aluno 2' },
    { id: 3, name: 'Aluno 3' },
  ];

  const mockClassRooms = [
    { id: 1, name: 'Sala 1' },
    { id: 2, name: 'Sala 2' },
    { id: 3, name: 'Sala 3' },
  ];

  beforeEach(() => {
    (useEnrollments as jest.Mock).mockReturnValue({ enrollments: mockEnrollments });
    (useStudents as jest.Mock).mockReturnValue({ students: mockStudents });
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: mockClassRooms });
  });

  it('renderiza lista completa de matrículas', () => {
    render(<EnrollmentsPage />);
    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Aluno 2')).toBeInTheDocument();
    expect(screen.getByText('Aluno 3')).toBeInTheDocument();
  });

  it('filtra matrículas pelo status', () => {
    render(<EnrollmentsPage />);
    const input = screen.getByPlaceholderText('Buscar Matrícula ou Status...');
    fireEvent.change(input, { target: { value: 'ativo' } });

    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Aluno 3')).toBeInTheDocument();
    expect(screen.queryByText('Aluno 2')).not.toBeInTheDocument();
  });

  it('exibe nomes de alunos e turmas corretamente', () => {
    render(<EnrollmentsPage />);
    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Sala 1')).toBeInTheDocument();
    expect(screen.getByText('Aluno 2')).toBeInTheDocument();
    expect(screen.getByText('Sala 2')).toBeInTheDocument();
  });

  it('links de ações possuem URLs corretas', () => {
    render(<EnrollmentsPage />);
    expect(screen.getByText('Detalhes').closest('a')).toHaveAttribute('href', '/enrollments/details/1');
    expect(screen.getByText('Editar').closest('a')).toHaveAttribute('href', '/enrollments/edit/1');
    expect(screen.getByText('Excluir').closest('a')).toHaveAttribute('href', '/enrollments/delete/1');
  });

  it('botão "Cadastrar Nova Matrícula" possui link correto', () => {
    render(<EnrollmentsPage />);
    expect(screen.getByText('Cadastrar Nova Matrícula').closest('a')).toHaveAttribute('href', '/enrollments/create');
  });

  it('exibe mensagem quando não há resultados', () => {
    render(<EnrollmentsPage />);
    const input = screen.getByPlaceholderText('Buscar Matrícula ou Status...');
    fireEvent.change(input, { target: { value: 'inexistente' } });

    expect(screen.getByText('Nenhuma matrícula encontrada.')).toBeInTheDocument();
  });

  it('filtra de forma case-insensitive', () => {
    render(<EnrollmentsPage />);
    const input = screen.getByPlaceholderText('Buscar Matrícula ou Status...');
    fireEvent.change(input, { target: { value: 'ATIVO' } });

    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Aluno 3')).toBeInTheDocument();
  });
});
