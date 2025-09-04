// src/app/subjects/details/[id]/DetailsPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SubjectDetailsPage from './page';
import * as nextRouter from 'next/navigation';
import * as useSubjectsHook from '../../../hooks/useSubjects';

describe('SubjectDetailsPage', () => {
  const pushMock = jest.fn();

  const mockSubject = {
    id: 123,
    name: 'Matemática',
    description: 'Álgebra e Geometria',
    workloadHours: 80,
  };

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();
  });

  it('renderiza detalhes de uma disciplina existente', () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(mockSubject.id) });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: (id: number) => (id === mockSubject.id ? mockSubject : undefined),
    } as any);

    render(<SubjectDetailsPage />);

    expect(screen.getByRole('heading', { level: 1, name: /detalhes da disciplina/i })).toBeInTheDocument();
    expect(screen.getByText(mockSubject.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockSubject.workloadHours} horas`)).toBeInTheDocument();
    expect(screen.getByText(mockSubject.description)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
  });

  it('mostra mensagem quando disciplina não encontrada', () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '999' });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: () => undefined,
    } as any);

    render(<SubjectDetailsPage />);

    expect(screen.getByText(/disciplina não encontrada/i)).toBeInTheDocument();

    const voltarBtn = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(voltarBtn);
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Editar redireciona corretamente', () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(mockSubject.id) });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: (id: number) => (id === mockSubject.id ? mockSubject : undefined),
    } as any);

    render(<SubjectDetailsPage />);

    const editBtn = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editBtn);
    expect(pushMock).toHaveBeenCalledWith(`/subjects/edit/${mockSubject.id}`);
  });

  it('botão Voltar redireciona corretamente', () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(mockSubject.id) });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: (id: number) => (id === mockSubject.id ? mockSubject : undefined),
    } as any);

    render(<SubjectDetailsPage />);

    const voltarBtn = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(voltarBtn);
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
