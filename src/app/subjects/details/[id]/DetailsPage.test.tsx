// src/app/subjects/details/[id]/DetailsPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import SubjectDetailsPage from './page';
import { mockSubjects } from '../../../mocks/subjects';
import * as nextRouter from 'next/navigation';

describe('SubjectDetailsPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();
  });

  it('renderiza detalhes de uma disciplina existente', () => {
    const subject = mockSubjects[0];
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subject.id) });

    render(<SubjectDetailsPage />);

    expect(screen.getByRole('heading', { level: 1, name: /detalhes da disciplina/i })).toBeInTheDocument();
    expect(screen.getByText(subject.name)).toBeInTheDocument();
    expect(screen.getByText(`${subject.workloadHours} horas`)).toBeInTheDocument();
    expect(screen.getByText(subject.description)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
  });

  it('mostra mensagem quando disciplina não encontrada', () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '999' });

    render(<SubjectDetailsPage />);

    expect(screen.getByText(/disciplina não encontrada/i)).toBeInTheDocument();
    const voltarBtn = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(voltarBtn);
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Editar redireciona corretamente', () => {
    const subject = mockSubjects[0];
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subject.id) });

    render(<SubjectDetailsPage />);

    const editBtn = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editBtn);
    expect(pushMock).toHaveBeenCalledWith(`/subjects/edit/${subject.id}`);
  });

  it('botão Voltar redireciona corretamente', () => {
    const subject = mockSubjects[0];
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subject.id) });

    render(<SubjectDetailsPage />);

    const voltarBtn = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(voltarBtn);
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
