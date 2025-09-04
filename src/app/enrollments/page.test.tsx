// src/app/enrollments/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EnrollmentsPage from './page';
import mockEnrollments from '../mocks/enrollments';
import mockStudents from '../mocks/students';
import { mockClassRooms } from '../mocks/classRooms';

describe('EnrollmentsPage', () => {
  beforeEach(() => {
    // Reset das matrículas
    mockEnrollments.length = 0;
    mockEnrollments.push(
      { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-01', status: 'Ativo' },
      { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-02-01', status: 'Inativo' },
      { id: 3, studentId: 3, classRoomId: 3, enrollmentDate: '2025-03-01', status: 'Ativo' }
    );

    // Reset dos estudantes (Student completo)
    mockStudents.length = 0;
    mockStudents.push(
      {
        id: 1,
        name: 'Aluno 1',
        email: 'aluno1@email.com',
        dateOfBirth: '2000-01-01',
        enrollmentNumber: 'ENR001',
        phone: '999999001',
        address: 'Rua A, 1'
      },
      {
        id: 2,
        name: 'Aluno 2',
        email: 'aluno2@email.com',
        dateOfBirth: '2000-02-02',
        enrollmentNumber: 'ENR002',
        phone: '999999002',
        address: 'Rua B, 2'
      },
      {
        id: 3,
        name: 'Aluno 3',
        email: 'aluno3@email.com',
        dateOfBirth: '2000-03-03',
        enrollmentNumber: 'ENR003',
        phone: '999999003',
        address: 'Rua C, 3'
      }
    );

    // Reset das salas de aula (ClassRoom completo)
    mockClassRooms.length = 0;
    mockClassRooms.push(
      {
        id: 1,
        name: 'Sala 1',
        capacity: 30,
        schedule: 'Seg - 08:00 às 10:00',
        subjects: [],
        teachers: [],
        classTeacher: {
          id: 1,
          name: 'Professor 1',
          email: 'prof1@email.com',
          dateOfBirth: '1980-01-01',
          subject: 'Matemática',
          phone: '123456789',
          address: 'Rua A'
        }
      },
      {
        id: 2,
        name: 'Sala 2',
        capacity: 25,
        schedule: 'Ter - 10:00 às 12:00',
        subjects: [],
        teachers: [],
        classTeacher: {
          id: 2,
          name: 'Professor 2',
          email: 'prof2@email.com',
          dateOfBirth: '1980-02-02',
          subject: 'História',
          phone: '987654321',
          address: 'Rua B'
        }
      },
      {
        id: 3,
        name: 'Sala 3',
        capacity: 20,
        schedule: 'Qua - 08:00 às 10:00',
        subjects: [],
        teachers: [],
        classTeacher: {
          id: 3,
          name: 'Professor 3',
          email: 'prof3@email.com',
          dateOfBirth: '1980-03-03',
          subject: 'Geografia',
          phone: '111222333',
          address: 'Rua C'
        }
      }
    );
  });

  it('renderiza lista de matrículas com paginação', () => {
    render(<EnrollmentsPage />);
    
    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Aluno 2')).toBeInTheDocument();
    expect(screen.queryByText('Aluno 3')).not.toBeInTheDocument();

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
    expect(screen.getByText('Página 1 de 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Próxima'));
    expect(screen.getByText('Página 1 de 1')).toBeInTheDocument();
  });

  it('exibe mensagem quando não há resultados', () => {
    render(<EnrollmentsPage />);
    const input = screen.getByPlaceholderText('Buscar Matrícula ou Status...');
    fireEvent.change(input, { target: { value: 'inexistente' } });

    expect(screen.getByText('Nenhuma matrícula encontrada.')).toBeInTheDocument();
  });
});
