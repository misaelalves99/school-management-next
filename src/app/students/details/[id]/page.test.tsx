// src/app/students/details/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import StudentDetailsPage from './page';
import * as nextRouter from 'next/navigation';

describe('StudentDetailsPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '123' });
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();
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
});
