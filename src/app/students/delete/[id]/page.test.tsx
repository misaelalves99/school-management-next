// src/app/students/delete/[id]/page.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteStudentPage from './page';
import * as nextRouter from 'next/navigation';
import * as useStudentsHook from '../../../hooks/useStudents';

describe('DeleteStudentPage', () => {
  const pushMock = jest.fn();
  const alertMock = jest.fn();
  const deleteStudentMock = jest.fn();

  beforeEach(() => {
    // Mock do useParams com id válido
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '1' });
    // Mock do useRouter
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    // Mock de alert
    jest.spyOn(window, 'alert').mockImplementation(alertMock);
    // Mock do hook useStudents
    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      students: [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@email.com',
          enrollmentNumber: '20230001',
          dateOfBirth: '2000-01-01',
          phone: '',
          address: ''
        },
      ],
      deleteStudent: deleteStudentMock,
    } as any);

    pushMock.mockClear();
    alertMock.mockClear();
    deleteStudentMock.mockClear();
  });

  it('renderiza título e nome do aluno', () => {
    render(<DeleteStudentPage />);
    expect(screen.getByRole('heading', { name: /excluir aluno/i })).toBeInTheDocument();
    expect(screen.getByText(/joão silva/i)).toBeInTheDocument();
  });

  it('ao confirmar exclusão exibe alerta e redireciona para /students', async () => {
    render(<DeleteStudentPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /excluir/i }));

    expect(deleteStudentMock).toHaveBeenCalledWith(1);
    expect(alertMock).toHaveBeenCalledWith('Aluno "João Silva" excluído com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('ao clicar em Cancelar redireciona para /students sem exibir alerta', async () => {
    render(<DeleteStudentPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(pushMock).toHaveBeenCalledWith('/students');
    expect(alertMock).not.toHaveBeenCalled();
    expect(deleteStudentMock).not.toHaveBeenCalled();
  });

  it('mostra mensagem de ID inválido se params.id for string vazia', () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '' }); 
    render(<DeleteStudentPage />);
    expect(screen.getByText(/id inválido/i)).toBeInTheDocument();
  });

  it('mostra mensagem de aluno não encontrado se ID não existir', () => {
    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      students: [],
      deleteStudent: deleteStudentMock,
    } as any);
    render(<DeleteStudentPage />);
    expect(screen.getByText(/aluno não encontrado/i)).toBeInTheDocument();
  });
});
