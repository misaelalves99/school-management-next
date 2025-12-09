// src/app/(dashboard)/subjects/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import SubjectDeletePage from './page.jsx';
import { useSubjects } from '@/core/hooks/useSubjects.js';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useSubjects');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('SubjectDeletePage (dashboard)', () => {
  const pushMock = jest.fn();
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('mostra estado de carregamento inicialmente', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 1,
        name: 'Matemática',
        description: 'Disciplina de exatas',
        workloadHours: 80,
      }),
      deleteSubject: jest.fn(),
    });

    render(<SubjectDeletePage />);

    expect(
      screen.getByText(/Carregando dados da disciplina/i),
    ).toBeInTheDocument();
  });

  it('exibe mensagem de não encontrado para id inválido', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: 'abc' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(),
      deleteSubject: jest.fn(),
    });

    render(<SubjectDeletePage />);

    expect(
      screen.getByText(/Disciplina não encontrada/i),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /Voltar para disciplinas/i }),
    );
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('exibe mensagem de não encontrado quando disciplina não existe', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '99' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => undefined,
      deleteSubject: jest.fn(),
    });

    render(<SubjectDeletePage />);

    expect(
      screen.getByText(/Disciplina não encontrada/i),
    ).toBeInTheDocument();
  });

  it('renderiza informações da disciplina quando encontrada', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '2' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 2,
        name: 'História',
        description: 'Estudo de eventos históricos',
        workloadHours: 60,
      }),
      deleteSubject: jest.fn(),
    });

    render(<SubjectDeletePage />);

    expect(await screen.findByText('História')).toBeInTheDocument();
    expect(
      screen.getByText(/Estudo de eventos históricos/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/60h de carga horária/i),
    ).toBeInTheDocument();
  });

  it('usa placeholder quando disciplina não tem descrição', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 3,
        name: 'Biologia',
        description: '',
        workloadHours: undefined,
      }),
      deleteSubject: jest.fn(),
    });

    render(<SubjectDeletePage />);

    expect(await screen.findByText('Biologia')).toBeInTheDocument();
    expect(
      screen.getByText(/Disciplina sem descrição cadastrada/i),
    ).toBeInTheDocument();
  });

  it('remove disciplina ao confirmar exclusão', async () => {
    const deleteMock = jest.fn();

    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 4,
        name: 'Geografia',
        description: 'Descrição teste',
        workloadHours: 45,
      }),
      deleteSubject: deleteMock,
    });

    render(<SubjectDeletePage />);

    const confirmButton = await screen.findByRole('button', {
      name: /Confirmar exclusão/i,
    });
    fireEvent.click(confirmButton);

    expect(deleteMock).toHaveBeenCalledWith(4);
    expect(alertMock).toHaveBeenCalledWith(
      'Disciplina removida com sucesso!',
    );
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('não remove quando usuário clica em cancelar', async () => {
    const deleteMock = jest.fn();

    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 5,
        name: 'Física',
        description: 'Disciplina de física básica',
        workloadHours: 70,
      }),
      deleteSubject: deleteMock,
    });

    render(<SubjectDeletePage />);

    const cancelButton = await screen.findByRole('button', {
      name: /Cancelar/i,
    });
    fireEvent.click(cancelButton);

    expect(deleteMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
