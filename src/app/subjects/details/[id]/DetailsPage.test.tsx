// src/app/subjects/details/[id]/DetailsPage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('mostra mensagem quando disciplina não encontrada', async () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '999' });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: () => undefined,
    } as any);

    render(<SubjectDetailsPage />);
    const user = userEvent.setup();

    expect(screen.getByText(/disciplina não encontrada/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /voltar/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Editar redireciona corretamente', async () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(mockSubject.id) });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: (id: number) => (id === mockSubject.id ? mockSubject : undefined),
    } as any);

    render(<SubjectDetailsPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /editar/i }));
    expect(pushMock).toHaveBeenCalledWith(`/subjects/edit/${mockSubject.id}`);
  });

  it('botão Voltar redireciona corretamente', async () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(mockSubject.id) });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: (id: number) => (id === mockSubject.id ? mockSubject : undefined),
    } as any);

    render(<SubjectDetailsPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /voltar/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('mostra "Sem descrição" se descrição estiver vazia', () => {
    const subjectWithoutDescription = { ...mockSubject, description: '' };
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subjectWithoutDescription.id) });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: () => subjectWithoutDescription,
    } as any);

    render(<SubjectDetailsPage />);
    expect(screen.getByText(/sem descrição/i)).toBeInTheDocument();
  });

  it('mostra "N/A" se carga horária for 0', () => {
    const subjectZeroHours = { ...mockSubject, workloadHours: 0 };
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subjectZeroHours.id) });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: () => subjectZeroHours,
    } as any);

    render(<SubjectDetailsPage />);
    expect(screen.getByText(/n\/a/i)).toBeInTheDocument();
  });
});
