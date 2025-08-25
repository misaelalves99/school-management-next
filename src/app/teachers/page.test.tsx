// src/app/teachers/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TeachersPage from './page';
import * as nextNavigation from 'next/navigation';
import * as teacherMocks from '../mocks/teachers';

describe('TeachersPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push: pushMock } as any);
  });

  it('renderiza lista de professores', () => {
    const teachers = [
      { id: 1, name: 'João', email: 'joao@mail.com', subject: 'Matemática' },
      { id: 2, name: 'Maria', email: 'maria@mail.com', subject: 'História' },
      { id: 3, name: 'Pedro', email: 'pedro@mail.com', subject: 'Física' },
    ];
    jest.spyOn(teacherMocks, 'getTeachers').mockReturnValue(teachers);

    render(<TeachersPage />);

    // Como PAGE_SIZE=2, apenas os 2 primeiros aparecem na primeira página
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.queryByText('Pedro')).not.toBeInTheDocument();
  });

  it('filtra professores pelo nome ou disciplina', () => {
    const teachers = [
      { id: 1, name: 'João', email: 'joao@mail.com', subject: 'Matemática' },
      { id: 2, name: 'Maria', email: 'maria@mail.com', subject: 'História' },
    ];
    jest.spyOn(teacherMocks, 'getTeachers').mockReturnValue(teachers);

    render(<TeachersPage />);
    const input = screen.getByLabelText(/Campo de busca de professores/i);
    fireEvent.change(input, { target: { value: 'história' } });

    expect(screen.queryByText('João')).not.toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('mostra mensagem quando nenhum professor é encontrado', () => {
    jest.spyOn(teacherMocks, 'getTeachers').mockReturnValue([]);
    render(<TeachersPage />);
    expect(screen.getByText(/Nenhum professor encontrado/i)).toBeInTheDocument();
  });

  it('navega para detalhes, edição e exclusão', () => {
    const teachers = [{ id: 1, name: 'João', email: 'joao@mail.com', subject: 'Matemática' }];
    jest.spyOn(teacherMocks, 'getTeachers').mockReturnValue(teachers);

    render(<TeachersPage />);

    fireEvent.click(screen.getByText(/Detalhes/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers/details/1');

    fireEvent.click(screen.getByText(/Editar/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers/edit/1');

    fireEvent.click(screen.getByText(/Excluir/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers/delete/1');
  });

  it('paginação funciona corretamente', () => {
    const teachers = [
      { id: 1, name: 'A', email: 'a@mail.com', subject: 'Subj1' },
      { id: 2, name: 'B', email: 'b@mail.com', subject: 'Subj2' },
      { id: 3, name: 'C', email: 'c@mail.com', subject: 'Subj3' },
    ];
    jest.spyOn(teacherMocks, 'getTeachers').mockReturnValue(teachers);

    render(<TeachersPage />);

    const nextBtn = screen.getByLabelText(/Próxima página/i);
    fireEvent.click(nextBtn);

    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.queryByText('A')).not.toBeInTheDocument();

    const prevBtn = screen.getByLabelText(/Página anterior/i);
    fireEvent.click(prevBtn);

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
  });

  it('botão de cadastro navega corretamente', () => {
    jest.spyOn(teacherMocks, 'getTeachers').mockReturnValue([]);
    render(<TeachersPage />);

    fireEvent.click(screen.getByText(/Cadastrar Novo Professor/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers/create');
  });
});
