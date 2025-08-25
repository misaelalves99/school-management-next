// src/app/teachers/details/[id]/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherDetails from './page';
import * as nextNavigation from 'next/navigation';
import * as teacherMocks from '../../../mocks/teachers';

describe('TeacherDetails Page', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push: pushMock } as any);
  });

  it('mostra mensagem de id inválido quando id não é fornecido', () => {
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({});
    render(<TeacherDetails />);
    expect(screen.getByText(/Id inválido/i)).toBeInTheDocument();
  });

  it('mostra mensagem de professor não encontrado quando id não existe', () => {
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '999' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(undefined);
    render(<TeacherDetails />);
    expect(screen.getByText(/Professor não encontrado/i)).toBeInTheDocument();
  });

  it('renderiza informações do professor corretamente', () => {
    const teacher = {
      id: 1,
      name: 'Maria',
      email: 'maria@mail.com',
      phone: '987654',
      subject: 'Matemática',
      address: 'Rua A, 123',
      dateOfBirth: '1990-01-01',
      photoUrl: '/foto.png',
    };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '1' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);

    render(<TeacherDetails />);

    expect(screen.getByText(/Detalhes do Professor/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria/i)).toBeInTheDocument();
    expect(screen.getByText(/maria@mail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Matemática/i)).toBeInTheDocument();
    expect(screen.getByText(/Rua A, 123/i)).toBeInTheDocument();
    expect(screen.getByText(/987654/i)).toBeInTheDocument();
    expect(screen.getByText(/01\/01\/1990/i)).toBeInTheDocument(); // data formatada
  });

  it('navega para edição ao clicar em "Editar"', () => {
    const teacher = {
      id: 2,
      name: 'Carlos',
      email: 'carlos@mail.com',
      phone: '55555',
      subject: 'Física',
      address: 'Av. B, 456',
      dateOfBirth: '1985-05-10',
      photoUrl: '',
    };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '2' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);

    render(<TeacherDetails />);
    fireEvent.click(screen.getByText(/Editar/i));

    expect(pushMock).toHaveBeenCalledWith('/teachers/edit/2');
  });

  it('navega de volta à lista ao clicar em "Voltar à Lista"', () => {
    const teacher = {
      id: 3,
      name: 'Ana',
      email: 'ana@mail.com',
      phone: '33333',
      subject: 'História',
      address: 'Praça C, 789',
      dateOfBirth: '1992-07-15',
      photoUrl: '',
    };
    jest.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '3' });
    jest.spyOn(teacherMocks, 'getTeacherById').mockReturnValue(teacher);

    render(<TeacherDetails />);
    fireEvent.click(screen.getByText(/Voltar à Lista/i));

    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
