// src/app/teachers/details/[id]/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherDetailsPage from './page';
import * as nextNavigation from 'next/navigation';
import { useTeachers } from '../../../hooks/useTeachers';

jest.mock('next/navigation', () => ({ useRouter: jest.fn(), useParams: jest.fn() }));
jest.mock('../../../hooks/useTeachers');

describe('TeacherDetailsPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('mostra mensagem de professor não encontrado quando id não existe ou inválido', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });
    (useTeachers as jest.Mock).mockReturnValue({ getTeacherById: () => undefined });

    render(<TeacherDetailsPage />);
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
    };
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useTeachers as jest.Mock).mockReturnValue({ getTeacherById: () => teacher });

    render(<TeacherDetailsPage />);

    expect(screen.getByText(/Detalhes do Professor/i)).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('maria@mail.com')).toBeInTheDocument();
    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('Rua A, 123')).toBeInTheDocument();
    expect(screen.getByText('987654')).toBeInTheDocument();
    expect(screen.getByText('01/01/1990')).toBeInTheDocument(); // data formatada
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
    };
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '2' });
    (useTeachers as jest.Mock).mockReturnValue({ getTeacherById: () => teacher });

    render(<TeacherDetailsPage />);
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
    };
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });
    (useTeachers as jest.Mock).mockReturnValue({ getTeacherById: () => teacher });

    render(<TeacherDetailsPage />);
    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(pushMock).toHaveBeenCalledWith('/teachers');
  });
});
