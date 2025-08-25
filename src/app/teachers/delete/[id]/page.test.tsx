// src/app/teachers/delete/[id]/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherDelete from './page';
import * as nextNavigation from 'next/navigation';
import * as teacherMocks from '../../../mocks/teachers';

describe('TeacherDelete Page', () => {
  const pushMock = jest.fn();
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push: pushMock } as any);
  });

  it('mostra mensagem de id inválido quando id não é fornecido', () => {
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({});
    render(<TeacherDelete />);
    expect(screen.getByText(/Id inválido/i)).toBeInTheDocument();
  });

  it('mostra mensagem de professor não encontrado quando id não existe', () => {
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '999' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(undefined);
    render(<TeacherDelete />);
    expect(screen.getByText(/Professor não encontrado/i)).toBeInTheDocument();
  });

  it('renderiza informações do professor corretamente', () => {
    const teacher = { id: 1, name: 'João', email: 'joao@mail.com', phone: '123456' };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '1' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);

    render(<TeacherDelete />);

    expect(screen.getByText(/Excluir Professor/i)).toBeInTheDocument();
    expect(screen.getByText(/João/i)).toBeInTheDocument();
    expect(screen.getByText(/joao@mail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/123456/i)).toBeInTheDocument();
  });

  it('exclui professor e navega após confirmação', () => {
    const teacher = { id: 1, name: 'João', email: 'joao@mail.com', phone: '123456' };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '1' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);
    const deleteSpy = jest.spyOn(teacherMocks, 'deleteTeacher');

    render(<TeacherDelete />);
    const deleteButton = screen.getByText(/Excluir/i);
    fireEvent.click(deleteButton);

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(alertMock).toHaveBeenCalledWith('Professor excluído com sucesso.');
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });

  it('cancela exclusão e navega de volta', () => {
    const teacher = { id: 1, name: 'João', email: 'joao@mail.com', phone: '123456' };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '1' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);

    render(<TeacherDelete />);
    const cancelButton = screen.getByText(/Cancelar/i);
    fireEvent.click(cancelButton);

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
