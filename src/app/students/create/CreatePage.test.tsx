// src/app/students/create/CreatePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CreateStudentPage from './page';
import * as nextRouter from 'next/navigation';
import * as useStudentsHook from '../../hooks/useStudents';

describe('CreateStudentPage', () => {
  const pushMock = jest.fn();
  const addStudentMock = jest.fn();

  beforeEach(() => {
    // Mock do useRouter
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();

    // Mock do useStudents
    jest.spyOn(useStudentsHook, 'useStudents').mockReturnValue({
      addStudent: addStudentMock,
      students: [],
    } as any);
    addStudentMock.mockClear();
  });

  it('renderiza todos os campos e botões', () => {
    render(<CreateStudentPage />);
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/matrícula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('mostra erros de validação ao submeter campos obrigatórios vazios', () => {
    render(<CreateStudentPage />);
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/matrícula é obrigatória/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
    expect(addStudentMock).not.toHaveBeenCalled();
  });

  it('mostra erro para email inválido', () => {
    render(<CreateStudentPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'email-invalido' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    expect(addStudentMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('mostra erro para telefone inválido', () => {
    render(<CreateStudentPage />);
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.getByText(/telefone inválido/i)).toBeInTheDocument();
    expect(addStudentMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('mostra erro para endereço muito curto', () => {
    render(<CreateStudentPage />);
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.getByText(/endereço muito curto/i)).toBeInTheDocument();
    expect(addStudentMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submete o formulário corretamente quando os campos obrigatórios são preenchidos', () => {
    render(<CreateStudentPage />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/matrícula/i), { target: { value: '20230001' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '+55123456789' } });
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: 'Rua A, 123' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.queryByText(/é obrigatório/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/muito curto/i)).not.toBeInTheDocument();

    expect(addStudentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'João',
        email: 'joao@email.com',
        dateOfBirth: '2000-01-01',
        enrollmentNumber: '20230001',
        phone: '+55123456789',
        address: 'Rua A, 123',
      })
    );
    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('botão "Cancelar" navega corretamente', () => {
    render(<CreateStudentPage />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/students');
  });
});
