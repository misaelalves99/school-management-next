// src/app/students/edit/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditStudentPage from './page';
import * as nextRouter from 'next/navigation';

describe('EditStudentPage', () => {
  const pushMock = jest.fn();
  const alertMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(alertMock);
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();
    alertMock.mockClear();
  });

  it('renderiza formulário com dados do aluno encontrado', async () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '1' });

    render(<EditStudentPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
      expect(screen.getByDisplayValue('joao@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2000-01-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('20230001')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Rua A')).toBeInTheDocument();
    });
  });

  it('mostra alerta e redireciona se id não for fornecido', async () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({} as any);

    render(<EditStudentPage />);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('ID do aluno não fornecido.');
      expect(pushMock).toHaveBeenCalledWith('/students');
    });
  });

  it('mostra alerta e redireciona se aluno não for encontrado', async () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '999' });

    render(<EditStudentPage />);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Aluno não encontrado.');
      expect(pushMock).toHaveBeenCalledWith('/students');
    });
  });

  it('permite editar um campo e submeter formulário', async () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '1' });

    render(<EditStudentPage />);

    const nameInput = await screen.findByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });

    expect((nameInput as HTMLInputElement).value).toBe('Novo Nome');

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Aluno atualizado!');
      expect(pushMock).toHaveBeenCalledWith('/students');
    });
  });

  it('botão Voltar redireciona corretamente', async () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '1' });

    render(<EditStudentPage />);

    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));

    expect(pushMock).toHaveBeenCalledWith('/students');
  });
});
