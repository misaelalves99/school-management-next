// src/app/subjects/SubjectsPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SubjectsPage from './page';
import * as useSubjectsHook from '../hooks/useSubjects';
import { mockSubjects } from '../mocks/subjects';

describe('SubjectsPage', () => {
  beforeEach(() => {
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      subjects: mockSubjects,
    } as any);
  });

  it('renderiza títulos e botão de cadastro', () => {
    render(<SubjectsPage />);
    expect(screen.getByRole('heading', { name: /buscar disciplinas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /lista de disciplinas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cadastrar nova disciplina/i })).toHaveAttribute(
      'href',
      '/subjects/create'
    );
  });

  it('lista todas as disciplinas do hook', () => {
    render(<SubjectsPage />);
    mockSubjects.forEach(subject => {
      expect(screen.getByText(subject.name)).toBeInTheDocument();
      expect(screen.getByText(subject.description)).toBeInTheDocument();
      expect(screen.getByText(String(subject.workloadHours))).toBeInTheDocument();
    });
  });

  it('links de ação para cada disciplina estão corretos', () => {
    render(<SubjectsPage />);
    mockSubjects.forEach(subject => {
      // Seleciona o link pela tag 'a' e texto exato
      const detalhesLink = screen.getByText('Detalhes', { selector: 'a' });
      expect(detalhesLink).toHaveAttribute('href', `/subjects/details/${subject.id}`);

      const editarLink = screen.getByText('Editar', { selector: 'a' });
      expect(editarLink).toHaveAttribute('href', `/subjects/edit/${subject.id}`);

      const excluirLink = screen.getByText('Excluir', { selector: 'a' });
      expect(excluirLink).toHaveAttribute('href', `/subjects/delete/${subject.id}`);
    });
  });

  it('filtra disciplinas pelo nome ou descrição', () => {
    render(<SubjectsPage />);
    const input = screen.getByPlaceholderText(/digite o nome ou descrição/i);

    // Filtra pelo nome da primeira disciplina
    fireEvent.change(input, { target: { value: mockSubjects[0].name } });
    expect(screen.getByText(mockSubjects[0].name)).toBeInTheDocument();
    mockSubjects.slice(1).forEach(subject => {
      expect(screen.queryByText(subject.name)).not.toBeInTheDocument();
    });

    // Filtra por descrição da segunda disciplina
    fireEvent.change(input, { target: { value: mockSubjects[1].description } });
    expect(screen.getByText(mockSubjects[1].name)).toBeInTheDocument();
    expect(screen.queryByText(mockSubjects[0].name)).not.toBeInTheDocument();
  });

  it('mostra mensagem quando nenhuma disciplina é encontrada', () => {
    render(<SubjectsPage />);
    const input = screen.getByPlaceholderText(/digite o nome ou descrição/i);

    fireEvent.change(input, { target: { value: 'disciplina inexistente' } });
    expect(screen.getByText(/nenhuma disciplina encontrada/i)).toBeInTheDocument();
  });
});
