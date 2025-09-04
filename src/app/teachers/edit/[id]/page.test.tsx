// src/app/teachers/edit/[id]/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherEdit from './page';
import * as nextNavigation from 'next/navigation';
import { useTeachers } from '../../../hooks/useTeachers';

jest.mock('next/navigation', () => ({ useRouter: jest.fn(), useParams: jest.fn() }));
jest.mock('../../../hooks/useTeachers');

describe('TeacherEdit Page', () => {
  const pushMock = jest.fn();
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('exibe "Carregando..." inicialmente', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => ({
        id: 1, name: 'João', email: 'joao@mail.com',
        dateOfBirth: '1990-01-01', subject: 'Matemática',
        phone: '12345', address: 'Rua A, 123'
      }),
      updateTeacher: jest.fn(),
    });

    render(<TeacherEdit />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('redireciona se professor não for encontrado', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => undefined,
      updateTeacher: jest.fn(),
    });

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
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '2' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => teacher,
      updateTeacher: jest.fn(),
    });

    render(<TeacherEdit />);

    expect(await screen.findByDisplayValue('Maria')).toBeInTheDocument();
    expect(screen.getByDisplayValue('maria@mail.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1995-02-02')).toBeInTheDocument();
    expect(screen.getByDisplayValue('História')).toBeInTheDocument();
    expect(screen.getByDisplayValue('99999')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rua B, 456')).toBeInTheDocument();
  });

  it('mostra erros de validação ao tentar salvar com campos obrigatórios vazios', async () => {
    const teacher = {
      id: 3, name: '', email: '', dateOfBirth: '',
      subject: '', phone: '', address: ''
    };
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => teacher,
      updateTeacher: jest.fn(),
    });

    render(<TeacherEdit />);
    const submitBtn = await screen.findByText(/Salvar Alterações/i);
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
    const updateSpy = jest.fn().mockReturnValue(true);
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => teacher,
      updateTeacher: updateSpy,
    });

    render(<TeacherEdit />);
    const submitBtn = await screen.findByText(/Salvar Alterações/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(4, expect.objectContaining({
        name: 'Ana', email: 'ana@mail.com'
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
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => teacher,
      updateTeacher: () => false,
    });

    render(<TeacherEdit />);
    const submitBtn = await screen.findByText(/Salvar Alterações/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Erro ao atualizar professor');
    });
  });

  it('volta para lista ao clicar no botão "Voltar"', async () => {
    const teacher = {
      id: 6,
      name: 'Carlos',
      email: 'carlos@mail.com',
      dateOfBirth: '1980-12-12',
      subject: 'Biologia',
      phone: '77777',
      address: 'Av. Z, 321'
    };
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '6' });
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacherById: () => teacher,
      updateTeacher: jest.fn(),
    });

    render(<TeacherEdit />);
    const backBtn = await screen.findByText(/Voltar/i);
    fireEvent.click(backBtn);

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
