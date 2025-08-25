// src/app/students/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import DeleteStudentPage from './page';
import * as nextRouter from 'next/navigation';

describe('DeleteStudentPage', () => {
  const pushMock = jest.fn();
  const alertMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '123' });
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    jest.spyOn(window, 'alert').mockImplementation(alertMock);
    pushMock.mockClear();
    alertMock.mockClear();
  });

  it('renderiza título e ID do aluno', () => {
    render(<DeleteStudentPage />);
    expect(screen.getByRole('heading', { name: /excluir aluno/i })).toBeInTheDocument();
    expect(screen.getByText(/id: 123/i)).toBeInTheDocument();
  });

  it('ao confirmar exclusão exibe alerta e redireciona para /students', () => {
    render(<DeleteStudentPage />);
    fireEvent.submit(screen.getByRole('form')); // o form
    expect(alertMock).toHaveBeenCalledWith('Aluno 123 excluído!');
    expect(pushMock).toHaveBeenCalledWith('/students');
  });

  it('ao clicar em Cancelar redireciona para /students sem exibir alerta', () => {
    render(<DeleteStudentPage />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/students');
    expect(alertMock).not.toHaveBeenCalled();
  });
});
