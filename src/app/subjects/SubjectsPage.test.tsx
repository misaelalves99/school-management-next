// src/app/subjects/SubjectsPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SubjectsPage from './page';
import { mockSubjects } from '../mocks/subjects';

describe('SubjectsPage', () => {
  beforeEach(() => {
    render(<SubjectsPage />);
  });

  it('renderiza títulos e botões principais', () => {
    expect(screen.getByRole('heading', { name: /buscar disciplinas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /lista de disciplinas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cadastrar nova disciplina/i })).toHaveAttribute(
      'href',
      '/subjects/create'
    );
  });

  it('mostra disciplinas corretamente na tabela', () => {
    mockSubjects.slice(0, 2).forEach(subject => {
      expect(screen.getByText(subject.name)).toBeInTheDocument();
      expect(screen.getByText(subject.description)).toBeInTheDocument();
      expect(screen.getByText(String(subject.workloadHours))).toBeInTheDocument();
    });
  });

  it('botões de ação para cada disciplina têm links corretos', () => {
    const firstSubject = mockSubjects[0];
    expect(screen.getByRole('link', { name: /detalhes/i })).toHaveAttribute(
      'href',
      `/subjects/details/${firstSubject.id}`
    );
    expect(screen.getByRole('link', { name: /editar/i })).toHaveAttribute(
      'href',
      `/subjects/edit/${firstSubject.id}`
    );
    expect(screen.getByRole('link', { name: /excluir/i })).toHaveAttribute(
      'href',
      `/subjects/delete/${firstSubject.id}`
    );
  });

  it('pesquisa filtra disciplinas pelo nome ou descrição', () => {
    const input = screen.getByPlaceholderText(/digite o nome ou descrição/i);
    fireEvent.change(input, { target: { value: mockSubjects[0].name } });

    expect(screen.getByText(mockSubjects[0].name)).toBeInTheDocument();
    // Outros não devem aparecer
    mockSubjects.slice(1).forEach(subject => {
      expect(screen.queryByText(subject.name)).not.toBeInTheDocument();
    });
  });

  it('navegação entre páginas funciona corretamente', () => {
    const nextBtn = screen.getByText(/próxima/i);
    fireEvent.click(nextBtn);

    const page2Subjects = mockSubjects.slice(2, 4);
    page2Subjects.forEach(subject => {
      expect(screen.getByText(subject.name)).toBeInTheDocument();
    });

    const prevBtn = screen.getByText(/anterior/i);
    fireEvent.click(prevBtn);

    const page1Subjects = mockSubjects.slice(0, 2);
    page1Subjects.forEach(subject => {
      expect(screen.getByText(subject.name)).toBeInTheDocument();
    });
  });

  it('mostra mensagem quando nenhuma disciplina é encontrada', () => {
    const input = screen.getByPlaceholderText(/digite o nome ou descrição/i);
    fireEvent.change(input, { target: { value: 'disciplina inexistente' } });
    expect(screen.getByText(/nenhuma disciplina encontrada/i)).toBeInTheDocument();
  });
});
