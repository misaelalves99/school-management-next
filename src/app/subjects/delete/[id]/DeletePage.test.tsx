// src/app/subjects/delete/[id]/DeletePage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteSubjectPage from './page';
import * as nextRouter from 'next/navigation';
import * as useSubjectsHook from '../../../hooks/useSubjects';

describe('DeleteSubjectPage', () => {
  const pushMock = jest.fn();
  const deleteSubjectMock = jest.fn();
  const alertMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '123' });

    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      subjects: [
        {
          id: 123,
          name: 'Matemática',
          description: 'Álgebra e Geometria',
          workloadHours: 80,
        },
      ],
      deleteSubject: deleteSubjectMock,
    } as any);

    jest.spyOn(window, 'alert').mockImplementation(alertMock);

    pushMock.mockClear();
    deleteSubjectMock.mockClear();
    alertMock.mockClear();
  });

  it('renderiza título e nome da disciplina', () => {
    render(<DeleteSubjectPage />);
    expect(screen.getByRole('heading', { level: 1, name: /excluir disciplina/i })).toBeInTheDocument();
    expect(screen.getByText(/tem certeza que deseja excluir/i)).toBeInTheDocument();
    expect(screen.getByText(/matemática/i)).toBeInTheDocument();
  });

  it('botão Excluir chama deleteSubject e redireciona para /subjects', async () => {
    render(<DeleteSubjectPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /excluir/i }));
    expect(deleteSubjectMock).toHaveBeenCalledWith(123);
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Cancelar redireciona para /subjects sem chamar deleteSubject', async () => {
    render(<DeleteSubjectPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
    expect(deleteSubjectMock).not.toHaveBeenCalled();
  });

  it('exibe mensagem de ID inválido se params.id for string vazia', () => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: '' });
    render(<DeleteSubjectPage />);
    expect(screen.getByText(/id inválido/i)).toBeInTheDocument();
  });

  it('exibe mensagem "Disciplina não encontrada" se subject não existir', () => {
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      subjects: [],
      deleteSubject: deleteSubjectMock,
    } as any);

    render(<DeleteSubjectPage />);
    expect(screen.getByText(/disciplina não encontrada/i)).toBeInTheDocument();
  });
});
