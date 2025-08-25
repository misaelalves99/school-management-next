// src/app/enrollments/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EnrollmentsPage from './page';
import mockEnrollments from '../mocks/enrollments';
import mockStudents from '../mocks/students';
import mockClassRooms from '../mocks/classRooms';

describe('EnrollmentsPage', () => {
  beforeEach(() => {
    // Reset das matrículas
    mockEnrollments.length = 0;
    mockEnrollments.push(
      { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-01', status: 'Ativo' },
      { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-02-01', status: 'Inativo' },
      { id: 3, studentId: 3, classRoomId: 3, enrollmentDate: '2025-03-01', status: 'Ativo' }
    );

    // Reset dos estudantes
    mockStudents.length = 0;
    mockStudents.push(
      {
        id: 1,
        name: 'Aluno 1',
        email: 'aluno1@email.com',
        dateOfBirth: '2000-01-01',
        enrollmentNumber: '20250001',
        phone: '111111111',
        address: 'Rua A, 100'
      },
      {
        id: 2,
        name: 'Aluno 2',
        email: 'aluno2@email.com',
        dateOfBirth: '2001-02-02',
        enrollmentNumber: '20250002',
        phone: '222222222',
        address: 'Rua B, 200'
      },
      {
        id: 3,
        name: 'Aluno 3',
        email: 'aluno3@email.com',
        dateOfBirth: '2002-03-03',
        enrollmentNumber: '20250003',
        phone: '333333333',
        address: 'Rua C, 300'
      }
    );

    // Reset das salas de aula
    mockClassRooms.length = 0;
    mockClassRooms.push(
      {
        id: 1,
        name: 'Sala 1',
        capacity: 10,
        schedule: 'Seg 08:00',
        subjects: [],
        teachers: [],
        classTeacher: null
      },
      {
        id: 2,
        name: 'Sala 2',
        capacity: 20,
        schedule: 'Ter 10:00',
        subjects: [],
        teachers: [],
        classTeacher: null
      },
      {
        id: 3,
        name: 'Sala 3',
        capacity: 30,
        schedule: 'Qua 14:00',
        subjects: [],
        teachers: [],
        classTeacher: null
      }
    );
  });

  it('renderiza lista de matrículas com paginação', () => {
    render(<EnrollmentsPage />);
    // PageSize = 2, então só aparecem 2 primeiras
    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Aluno 2')).toBeInTheDocument();
    expect(screen.queryByText('Aluno 3')).not.toBeInTheDocument();

    // Botão próxima página
    fireEvent.click(screen.getByText('Próxima'));
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

  it('exibe corretamente nome do aluno e da turma', () => {
    render(<EnrollmentsPage />);
    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Sala 1')).toBeInTheDocument();
  });

  it('links de ações possuem URLs corretas', () => {
    render(<EnrollmentsPage />);
    expect(screen.getByText('Detalhes').closest('a')).toHaveAttribute('href', '/enrollments/details/1');
    expect(screen.getByText('Editar').closest('a')).toHaveAttribute('href', '/enrollments/edit/1');
    expect(screen.getByText('Excluir').closest('a')).toHaveAttribute('href', '/enrollments/delete/1');
  });

  it('botão "Cadastrar Nova Matrícula" possui link correto', () => {
    render(<EnrollmentsPage />);
    const link = screen.getByText('Cadastrar Nova Matrícula').closest('a');
    expect(link).toHaveAttribute('href', '/enrollments/create');
  });

  it('mostra página e total de páginas corretamente', () => {
    render(<EnrollmentsPage />);
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Próxima'));
    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
  });
});
