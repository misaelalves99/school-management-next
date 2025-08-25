// src/app/teachers/edit/[id]/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherEdit from './page';
import * as nextNavigation from 'next/navigation';
import * as teacherMocks from '../../../mocks/teachers';

describe('TeacherEdit Page', () => {
  const pushMock = jest.fn();
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push: pushMock } as any);
  });

  it('exibe "Carregando..." inicialmente', () => {
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '1' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue({
      id: 1, name: 'João', email: 'joao@mail.com',
      dateOfBirth: '1990-01-01', subject: 'Matemática',
      phone: '12345', address: 'Rua A, 123'
    });

    const { getByText } = render(<TeacherEdit />);
    expect(getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('redireciona se professor não for encontrado', async () => {
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '999' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(undefined);

    render(<TeacherEdit />);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Professor não encontrado');
      expect(pushMock).toHaveBeenCalledWith('/teachers');
    });
  });

  it('renderiza formulário preenchido corretamente', async () => {
    const teacher = {
      id: 2,
      name: 'Maria',
      email: 'maria@mail.com',
      dateOfBirth: '1995-02-02',
      subject: 'História',
      phone: '99999',
      address: 'Rua B, 456'
    };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '2' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);

    render(<TeacherEdit />);

    expect(await screen.findByDisplayValue('Maria')).toBeInTheDocument();
    expect(screen.getByDisplayValue('maria@mail.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1995-02-02')).toBeInTheDocument();
    expect(screen.getByDisplayValue('História')).toBeInTheDocument();
    expect(screen.getByDisplayValue('99999')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rua B, 456')).toBeInTheDocument();
  });

  it('mostra erros de validação ao tentar salvar com campos vazios', async () => {
    const teacher = {
      id: 3,
      name: '',
      email: '',
      dateOfBirth: '',
      subject: '',
      phone: '',
      address: ''
    };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '3' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);

    render(<TeacherEdit />);
    const submitBtn = await screen.findByText(/Salvar/i);
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/Disciplina é obrigatória/i)).toBeInTheDocument();
  });

  it('atualiza professor com sucesso e redireciona', async () => {
    const teacher = {
      id: 4,
      name: 'Ana',
      email: 'ana@mail.com',
      dateOfBirth: '1992-03-03',
      subject: 'Física',
      phone: '55555',
      address: 'Av. X, 123'
    };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '4' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);
    const updateSpy = jest.spyOn(teacherMocks, 'updateTeacher').mockReturnValue(true);

    render(<TeacherEdit />);
    const submitBtn = await screen.findByText(/Salvar/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(4, expect.objectContaining({
        name: 'Ana',
        email: 'ana@mail.com'
      }));
      expect(alertMock).toHaveBeenCalledWith('Professor atualizado com sucesso!');
      expect(pushMock).toHaveBeenCalledWith('/teachers');
    });
  });

  it('mostra erro caso updateTeacher falhe', async () => {
    const teacher = {
      id: 5,
      name: 'Pedro',
      email: 'pedro@mail.com',
      dateOfBirth: '1991-01-01',
      subject: 'Geografia',
      phone: '11111',
      address: 'Rua Y, 789'
    };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '5' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);
    jest.spyOn(teacherMocks, 'updateTeacher').mockReturnValue(false);

    render(<TeacherEdit />);
    const submitBtn = await screen.findByText(/Salvar/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Erro ao atualizar professor');
    });
  });

  it('volta para lista ao clicar no botão "Voltar à Lista"', async () => {
    const teacher = {
      id: 6,
      name: 'Carlos',
      email: 'carlos@mail.com',
      dateOfBirth: '1980-12-12',
      subject: 'Biologia',
      phone: '77777',
      address: 'Av. Z, 321'
    };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '6' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);

    render(<TeacherEdit />);
    const backBtn = await screen.findByText(/Voltar à Lista/i);
    fireEvent.click(backBtn);

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
