// src/app/students/edit/[id]/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentEditPage from './page';
import * as nextRouter from 'next/navigation';
import * as useStudentsHook from '../../../hooks/useStudents';

describe('StudentEditPage', () => {
  const pushMock = jest.fn();
  const alertMock = jest.fn();
  const updateStudentMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '123' });
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    jest.spyOn(window, 'alert').mockImplementation(alertMock);

    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      students: [
        {
          id: 123,
          name: 'João da Silva',
          email: 'joao@email.com',
          dateOfBirth: '2001-09-15',
          enrollmentNumber: '2025001',
          phone: '(11) 99999-9999',
          address: 'Rua Exemplo, 123',
        },
      ],
      updateStudent: updateStudentMock,
    } as any);

    pushMock.mockClear();
    alertMock.mockClear();
    updateStudentMock.mockClear();
  });

  it('renderiza o formulário com os dados do aluno', async () => {
    render(<StudentEditPage />);
    expect(screen.getByLabelText(/nome/i)).toHaveValue('João da Silva');
    expect(screen.getByLabelText(/email/i)).toHaveValue('joao@email.com');
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('2001-09-15');
    expect(screen.getByLabelText(/matrícula/i)).toHaveValue('2025001');
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('(11) 99999-9999');
    expect(screen.getByLabelText(/endereço/i)).toHaveValue('Rua Exemplo, 123');
  });

  it('mostra erros de validação se campos obrigatórios estiverem vazios', async () => {
    render(<StudentEditPage />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/matrícula/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));

    expect(await screen.findByText(/nome é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/email é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/matrícula é obrigatória/i)).toBeInTheDocument();
    expect(updateStudentMock).not.toHaveBeenCalled();
  });

  it('submete formulário com sucesso e navega para /students', async () => {
    updateStudentMock.mockReturnValue(true);

    render(<StudentEditPage />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Novo Nome' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(updateStudentMock).toHaveBeenCalledWith(123, expect.objectContaining({ name: 'Novo Nome' }));
      expect(alertMock).toHaveBeenCalledWith('Aluno atualizado com sucesso!');
      expect(pushMock).toHaveBeenCalledWith('/students');
    });
  });

  it('exibe alerta se atualização falhar', async () => {
    updateStudentMock.mockReturnValue(false);

    render(<StudentEditPage />);
    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Erro ao atualizar aluno');
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  it('botão Voltar navega corretamente', () => {
    render(<StudentEditPage />);
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('redireciona se aluno não for encontrado', () => {
    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      students: [],
      updateStudent: updateStudentMock,
    } as any);

    render(<StudentEditPage />);
    expect(alertMock).toHaveBeenCalledWith('Aluno não encontrado');
    expect(pushMock).toHaveBeenCalledWith('/students');
  });
});
