// src/app/(dashboard)/subjects/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import SubjectsPage from './page.jsx';
import { useSubjects } from '@/core/hooks/useSubjects.js';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useSubjects');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SubjectsPage (dashboard)', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('renderiza título, descrição e badge de quantidade', () => {
    (useSubjects as jest.Mock).mockReturnValue({
      subjects: [
        { id: 1, name: 'Matemática', description: 'Cálculo e álgebra', workloadHours: 80 },
        { id: 2, name: 'História', description: 'História geral', workloadHours: 60 },
      ],
    });

    render(<SubjectsPage />);

    expect(
      screen.getByRole('heading', { name: /Disciplinas/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Gerencie o catálogo de disciplinas/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/2 disciplinas cadastradas/i),
    ).toBeInTheDocument();
  });

  it('lista disciplinas e exibe dados principais', () => {
    (useSubjects as jest.Mock).mockReturnValue({
      subjects: [
        { id: 1, name: 'Matemática', description: 'Álgebra linear', workloadHours: 80 },
        { id: 2, name: 'Física', description: 'Mecânica clássica', workloadHours: 60 },
      ],
    });

    render(<SubjectsPage />);

    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('Física')).toBeInTheDocument();
    expect(screen.getByText(/80h/)).toBeInTheDocument();
    expect(screen.getByText(/60h/)).toBeInTheDocument();
    expect(screen.getByText(/Álgebra linear/)).toBeInTheDocument();
    expect(screen.getByText(/Mecânica clássica/)).toBeInTheDocument();
  });

  it('filtra disciplinas pelo texto digitado (nome ou descrição)', () => {
    (useSubjects as jest.Mock).mockReturnValue({
      subjects: [
        { id: 1, name: 'Matemática', description: 'Álgebra linear', workloadHours: 80 },
        { id: 2, name: 'Física', description: 'Ondulatória', workloadHours: 60 },
      ],
    });

    render(<SubjectsPage />);

    const input = screen.getByPlaceholderText(/Digite nome ou descrição/i);

    // Filtro por nome
    fireEvent.change(input, { target: { value: 'matemática' } });
    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.queryByText('Física')).not.toBeInTheDocument();

    // Filtro por descrição
    fireEvent.change(input, { target: { value: 'ondulatória' } });
    expect(screen.getByText('Física')).toBeInTheDocument();
    expect(screen.queryByText('Matemática')).not.toBeInTheDocument();
  });

  it('mostra estado vazio quando não há disciplinas após o filtro', () => {
    (useSubjects as jest.Mock).mockReturnValue({
      subjects: [
        { id: 1, name: 'Matemática', description: 'Álgebra linear', workloadHours: 80 },
      ],
    });

    render(<SubjectsPage />);

    const input = screen.getByPlaceholderText(/Digite nome ou descrição/i);
    fireEvent.change(input, { target: { value: 'disciplina inexistente' } });

    expect(
      screen.getByText(/Nenhuma disciplina encontrada/i),
    ).toBeInTheDocument();
  });

  it('botão "Nova disciplina" navega para /subjects/create', () => {
    (useSubjects as jest.Mock).mockReturnValue({
      subjects: [],
    });

    render(<SubjectsPage />);

    const createButton = screen.getByRole('button', { name: /Nova disciplina/i });
    fireEvent.click(createButton);

    expect(pushMock).toHaveBeenCalledWith('/subjects/create');
  });

  it('botões de ação navegam para detalhes, edição e exclusão', () => {
    (useSubjects as jest.Mock).mockReturnValue({
      subjects: [
        { id: 10, name: 'Biologia', description: 'Ecologia', workloadHours: 40 },
      ],
    });

    render(<SubjectsPage />);

    const detailsButton = screen.getByLabelText(/Ver detalhes da disciplina Biologia/i);
    const editButton = screen.getByLabelText(/Editar disciplina Biologia/i);
    const deleteButton = screen.getByLabelText(/Excluir disciplina Biologia/i);

    fireEvent.click(detailsButton);
    expect(pushMock).toHaveBeenCalledWith('/subjects/details/10');

    fireEvent.click(editButton);
    expect(pushMock).toHaveBeenCalledWith('/subjects/edit/10');

    fireEvent.click(deleteButton);
    expect(pushMock).toHaveBeenCalledWith('/subjects/delete/10');
  });
});
