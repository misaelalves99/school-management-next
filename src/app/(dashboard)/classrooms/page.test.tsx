// src/app/(dashboard)/classrooms/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ClassRoomsPage from './page';
import { useClassRooms } from '@/core/hooks/useClassRooms.js';

jest.mock('@/core/hooks/useClassRooms');
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('ClassRoomsPage (dashboard)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockClassRooms() {
    (useClassRooms as jest.Mock).mockReturnValue({
      classRooms: [
        {
          id: 1,
          name: '1º Ano A',
          code: '1A-MANHA',
          grade: '1º Ano',
          period: 'Manhã',
          capacity: 30,
          createdAt: '2024-02-01T00:00:00Z',
        },
        {
          id: 2,
          name: '2º Ano B',
          code: '2B-TARDE',
          grade: '2º Ano',
          period: 'Tarde',
          capacity: 28,
          createdAt: '2024-02-02T00:00:00Z',
        },
        {
          id: 3,
          name: '3º Ano C',
          code: '3C-NOITE',
          grade: '3º Ano',
          period: 'Noite',
          capacity: 35,
          createdAt: '2024-02-03T00:00:00Z',
        },
      ],
    });
  }

  it('renderiza o título e resumo de turmas', () => {
    mockClassRooms();

    render(<ClassRoomsPage />);

    expect(screen.getByText(/Turmas e Salas/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Organize turmas por série, período e capacidade/i),
    ).toBeInTheDocument();

    expect(screen.getByText('Total de turmas')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // totalClassRooms
  });

  it('lista as turmas da escola na tabela', () => {
    mockClassRooms();

    render(<ClassRoomsPage />);

    expect(screen.getByText('1º Ano A')).toBeInTheDocument();
    expect(screen.getByText(/Código: 1A-MANHA/i)).toBeInTheDocument();
    expect(screen.getByText('2º Ano B')).toBeInTheDocument();
    expect(screen.getByText('3º Ano C')).toBeInTheDocument();
  });

  it('filtra por termo de busca (nome, código ou série)', () => {
    mockClassRooms();

    render(<ClassRoomsPage />);

    const searchInput = screen.getByPlaceholderText(
      /Buscar por nome, código ou série/i,
    );
    fireEvent.change(searchInput, { target: { value: '2B-TARDE' } });

    expect(screen.queryByText('1º Ano A')).not.toBeInTheDocument();
    expect(screen.getByText('2º Ano B')).toBeInTheDocument();
    expect(screen.queryByText('3º Ano C')).not.toBeInTheDocument();
  });

  it('filtra por período (manhã, tarde, noite)', () => {
    mockClassRooms();

    render(<ClassRoomsPage />);

    const select = screen.getByDisplayValue(/Todos os períodos/i);

    // Filtrar somente manhã
    fireEvent.change(select, { target: { value: 'morning' } });
    expect(screen.getByText('1º Ano A')).toBeInTheDocument();
    expect(screen.queryByText('2º Ano B')).not.toBeInTheDocument();
    expect(screen.queryByText('3º Ano C')).not.toBeInTheDocument();

    // Filtrar somente noite
    fireEvent.change(select, { target: { value: 'night' } });
    expect(screen.queryByText('1º Ano A')).not.toBeInTheDocument();
    expect(screen.queryByText('2º Ano B')).not.toBeInTheDocument();
    expect(screen.getByText('3º Ano C')).toBeInTheDocument();
  });

  it('mostra badge com quantidade filtrada de turmas', () => {
    mockClassRooms();

    render(<ClassRoomsPage />);

    expect(
      screen.getByText(/3 turma\(s\) exibida\(s\)/i),
    ).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      /Buscar por nome, código ou série/i,
    );
    fireEvent.change(searchInput, { target: { value: '3º Ano C' } });

    expect(
      screen.getByText(/1 turma\(s\) exibida\(s\)/i),
    ).toBeInTheDocument();
  });

  it('possui link para criar nova turma', () => {
    mockClassRooms();

    render(<ClassRoomsPage />);

    const newClassLink = screen.getByRole('button', { name: /Nova turma/i });
    expect(newClassLink).toBeInTheDocument();
  });
});
