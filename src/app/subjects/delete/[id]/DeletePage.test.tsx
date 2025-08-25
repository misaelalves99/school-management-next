// src/app/subjects/delete/[id]/DeletePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import DeleteSubjectPage from './page';
import * as nextRouter from 'next/navigation';

describe('DeleteSubjectPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '123' });
    pushMock.mockClear();
  });

  it('renderiza títulos e informações da disciplina', () => {
    render(<DeleteSubjectPage />);
    expect(screen.getByRole('heading', { level: 1, name: /excluir disciplina/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /tem certeza que deseja excluir/i })).toBeInTheDocument();
    expect(screen.getByText(/nome da disciplina \(simulado\)/i)).toBeInTheDocument();
    expect(screen.getByText(/carga horária: 60 horas/i)).toBeInTheDocument();
  });

  it('botão Excluir redireciona para /subjects', () => {
    render(<DeleteSubjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Cancelar redireciona para /subjects', () => {
    render(<DeleteSubjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
