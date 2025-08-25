// src/app/subjects/SubjectsPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import SubjectsIndexPage from './page';
import { mockSubjects } from '@/app/mocks/subjects';

describe('SubjectsIndexPage', () => {
  it('renderiza títulos e botões principais', () => {
    render(<SubjectsIndexPage />);
    expect(screen.getByRole('heading', { name: /buscar disciplinas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /lista de disciplinas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cadastrar nova disciplina/i })).toBeInTheDocument();
  });

  it('mostra disciplinas paginadas corretamente', () => {
    render(<SubjectsIndexPage />);
    // Página 1: primeiro pageSize elementos
    mockSubjects.slice(0, 2).forEach(subject => {
      expect(screen.getByText(subject.name)).toBeInTheDocument();
    });
  });

  it('botões de ação para cada disciplina estão presentes', () => {
    render(<SubjectsIndexPage />);
    const firstSubject = mockSubjects[0];
    expect(screen.getByRole('link', { name: /detalhes/i, exact: false })).toHaveAttribute('href', `/subjects/details/${firstSubject.id}`);
    expect(screen.getByRole('link', { name: /editar/i, exact: false })).toHaveAttribute('href', `/subjects/edit/${firstSubject.id}`);
    expect(screen.getByRole('link', { name: /excluir/i, exact: false })).toHaveAttribute('href', `/subjects/delete/${firstSubject.id}`);
  });

  it('pesquisa filtra disciplinas pelo nome ou descrição', () => {
    render(<SubjectsIndexPage />);
    const input = screen.getByPlaceholderText(/digite o nome ou descrição/i);
    fireEvent.change(input, { target: { value: mockSubjects[0].name } });
    expect(screen.getByText(mockSubjects[0].name)).toBeInTheDocument();
    // Os outros não devem aparecer
    mockSubjects.slice(1).forEach(s => {
      expect(screen.queryByText(s.name)).not.toBeInTheDocument();
    });
  });

  it('navega entre páginas corretamente', () => {
    render(<SubjectsIndexPage />);
    const nextBtn = screen.getByText(/próxima/i);
    fireEvent.click(nextBtn);
    const page2Subjects = mockSubjects.slice(2, 4);
    page2Subjects.forEach(s => expect(screen.getByText(s.name)).toBeInTheDocument());
  });
});
