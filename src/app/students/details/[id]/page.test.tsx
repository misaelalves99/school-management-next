// src/app/students/details/[id]/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import StudentDetailsPage from './page';
import * as nextRouter from 'next/navigation';
import * as useStudentsHook from '../../../hooks/useStudents';

describe('StudentDetailsPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '123' });
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();

    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      getStudentById: (id: number) => {
        if (id === 123) {
          return {
            id: 123,
            name: 'João da Silva',
            email: 'joao@email.com',
            dateOfBirth: '2001-09-15',
            enrollmentNumber: '2025001',
            phone: '(11) 99999-9999',
            address: 'Rua Exemplo, 123',
          };
        }
        return undefined;
      }
    } as any);
  });

  it('renderiza título e dados do aluno', () => {
    render(<StudentDetailsPage />);
    expect(screen.getByRole('heading', { name: /detalhes do aluno/i })).toBeInTheDocument();
    expect(screen.getByText(/joão da silva/i)).toBeInTheDocument();
    expect(screen.getByText(/joao@email\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/2001-09-15/i)).toBeInTheDocument();
    expect(screen.getByText(/2025001/i)).toBeInTheDocument();
    expect(screen.getByText(/\(11\) 99999-9999/i)).toBeInTheDocument();
    expect(screen.getByText(/rua exemplo, 123/i)).toBeInTheDocument();
  });

  it('botão Editar navega para a página de edição', () => {
    render(<StudentDetailsPage />);
    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(pushMock).toHaveBeenCalledWith('/students/edit/123');
  });

  it('botão Voltar à Lista navega corretamente', () => {
    render(<StudentDetailsPage />);
    fireEvent.click(screen.getByRole('button', { name: /voltar à lista/i }));
    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('mostra mensagem de aluno não encontrado se ID inválido', () => {
    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      getStudentById: () => undefined
    } as any);
    render(<StudentDetailsPage />);
    expect(screen.getByRole('heading', { name: /aluno não encontrado/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /voltar à lista/i }));
    expect(pushMock).toHaveBeenCalledWith('/students');
  });
});
