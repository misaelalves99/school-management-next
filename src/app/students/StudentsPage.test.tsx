// src/app/students/StudentsPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import StudentsIndexPage from './page';
import mockStudents from '../mocks/students';

describe('StudentsIndexPage', () => {
  it('renderiza título e lista de alunos', () => {
    render(<StudentsIndexPage />);
    
    // Títulos
    expect(screen.getByText(/buscar alunos/i)).toBeInTheDocument();
    expect(screen.getByText(/lista de alunos/i)).toBeInTheDocument();
    
    // Renderiza alunos do mock
    mockStudents.slice(0, 10).forEach(student => {
      expect(screen.getByText(student.name)).toBeInTheDocument();
      expect(screen.getByText(student.enrollmentNumber)).toBeInTheDocument();
    });
    
    // Botão Cadastrar Novo Aluno
    expect(screen.getByRole('link', { name: /cadastrar novo aluno/i })).toBeInTheDocument();
  });

  it('filtra alunos pelo campo de busca', () => {
    render(<StudentsIndexPage />);
    const input = screen.getByPlaceholderText(/digite o nome/i);
    
    fireEvent.change(input, { target: { value: 'João' } });
    fireEvent.submit(screen.getByRole('form'));
    
    expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
    // Deve esconder alunos que não batem
    mockStudents
      .filter(s => !s.name.includes('João'))
      .forEach(s => {
        expect(screen.queryByText(s.name)).not.toBeInTheDocument();
      });
  });

  it('navegação nos links de ações existe', () => {
    render(<StudentsIndexPage />);
    mockStudents.slice(0, 1).forEach(student => {
      expect(screen.getByRole('link', { name: /detalhes/i, href: `/students/details/${student.id}` })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /editar/i, href: `/students/edit/${student.id}` })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /excluir/i, href: `/students/delete/${student.id}` })).toBeInTheDocument();
    });
  });

  it('botões de paginação funcionam', () => {
    render(<StudentsIndexPage />);
    const pageInfo = screen.getByText(/página 1 de/i);
    expect(pageInfo).toBeInTheDocument();

    const nextBtn = screen.getByText(/próxima/i);
    fireEvent.click(nextBtn);
    expect(screen.getByText(/página 2 de/i)).toBeInTheDocument();

    const prevBtn = screen.getByText(/anterior/i);
    fireEvent.click(prevBtn);
    expect(screen.getByText(/página 1 de/i)).toBeInTheDocument();
  });
});
