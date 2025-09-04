// src/app/teachers/delete/[id]/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteTeacherPage from './page';
import * as nextNavigation from 'next/navigation';
import { useTeachers } from '../../../hooks/useTeachers';

jest.mock('next/navigation', () => ({ useRouter: jest.fn(), useParams: jest.fn() }));
jest.mock('../../../hooks/useTeachers');

describe('DeleteTeacherPage', () => {
  const pushMock = jest.fn();
  const deleteTeacherMock = jest.fn();

  beforeEach(() => {
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it('mostra mensagem de ID inválido quando id não é fornecido', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({});
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [], deleteTeacher: deleteTeacherMock });

    render(<DeleteTeacherPage />);
    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();
  });

  it('mostra mensagem de professor não encontrado quando id não existe', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [], deleteTeacher: deleteTeacherMock });

    render(<DeleteTeacherPage />);
    expect(screen.getByText(/Professor não encontrado/i)).toBeInTheDocument();
  });

  it('renderiza informações do professor corretamente', () => {
    const teacher = { id: 1, name: 'João', email: 'joao@mail.com', phone: '123456' };
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [teacher], deleteTeacher: deleteTeacherMock });

    render(<DeleteTeacherPage />);
    expect(screen.getByText(/Excluir Professor/i)).toBeInTheDocument();
    expect(screen.getByText(/João/i)).toBeInTheDocument();
  });

  it('exclui professor e navega após confirmação', () => {
    const teacher = { id: 1, name: 'João', email: 'joao@mail.com', phone: '123456' };
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [teacher], deleteTeacher: deleteTeacherMock });

    render(<DeleteTeacherPage />);
    const deleteButton = screen.getByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButton);

    expect(deleteTeacherMock).toHaveBeenCalledWith(1);
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });

  it('cancela exclusão e navega de volta', () => {
    const teacher = { id: 1, name: 'João', email: 'joao@mail.com', phone: '123456' };
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useTeachers as jest.Mock).mockReturnValue({ teachers: [teacher], deleteTeacher: deleteTeacherMock });

    render(<DeleteTeacherPage />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
