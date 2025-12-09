// src/app/(dashboard)/subjects/details/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import SubjectDetailsPage from './page.jsx';
import { useSubjects } from '@/core/hooks/useSubjects.js';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useSubjects');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('SubjectDetailsPage (dashboard)', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('mostra estado vazio quando id é inválido ou disciplina não existe', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: 'abc' });
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(),
    });

    render(<SubjectDetailsPage />);

    expect(
      screen.getByText(/disciplina não encontrada/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/não encontramos nenhuma disciplina/i),
    ).toBeInTheDocument();
  });

  it('renderiza dados da disciplina corretamente', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: (id: number) =>
        id === 3
          ? {
              id: 3,
              name: 'Matemática',
              description: 'Disciplina focada em álgebra e geometria.',
              workloadHours: 80,
            }
          : undefined,
    });

    render(<SubjectDetailsPage />);

    // heading principal com nome da disciplina
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/matemática/i);

    expect(
      screen.getByText(/disciplina focada em álgebra e geometria/i),
    ).toBeInTheDocument();

    // carga horária
    expect(screen.getByText(/80h/i)).toBeInTheDocument();

    // ID visível em algum lugar da tela
    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  it('mostra mensagens padrão quando descrição está vazia e workload não definido', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 5,
        name: 'História',
        description: '',
        workloadHours: undefined,
      }),
    });

    render(<SubjectDetailsPage />);

    // descrição ausente
    expect(
      screen.getByText(/nenhuma descrição cadastrada/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/adicione uma descrição para ajudar/i),
    ).toBeInTheDocument();

    // carga horária ausente
    expect(screen.getByText(/não definido/i)).toBeInTheDocument();
    expect(
      screen.getByText(/carga horária pendente/i),
    ).toBeInTheDocument();
  });

  it('navega ao clicar em "Voltar para disciplinas"', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '10' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 10,
        name: 'Biologia',
        description: 'Disciplina de ciências da vida.',
        workloadHours: 60,
      }),
    });

    render(<SubjectDetailsPage />);

    const backButtons = screen.getAllByRole('button', {
      name: /voltar para disciplinas/i,
    });

    backButtons.forEach((btn) => fireEvent.click(btn));

    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('navega para edição e exclusão nos botões de ação', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 4,
        name: 'Física',
        description: 'Disciplina de movimento, energia e forças.',
        workloadHours: 60,
      }),
    });

    render(<SubjectDetailsPage />);

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects/edit/4');

    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects/delete/4');
  });
});
