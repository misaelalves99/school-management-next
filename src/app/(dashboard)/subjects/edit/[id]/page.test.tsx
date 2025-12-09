// src/app/(dashboard)/subjects/edit/[id]/EditPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import SubjectEditPage from './page';
import { useSubjects } from '@/core/hooks/useSubjects';
import * as nextNavigation from 'next/navigation';

jest.mock('@/core/hooks/useSubjects');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('SubjectEditPage (dashboard)', () => {
  const pushMock = jest.fn();
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('exibe estado de carregamento inicialmente', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 1,
        name: 'Matemática',
        description: 'Disciplina de exatas.',
        workloadHours: 80,
      }),
      updateSubject: jest.fn(),
    });

    render(<SubjectEditPage />);

    expect(
      screen.getByText(/Carregando disciplina/i),
    ).toBeInTheDocument();
  });

  it('exibe mensagem de não encontrado se id for inválido', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: 'abc' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(),
      updateSubject: jest.fn(),
    });

    render(<SubjectEditPage />);

    expect(
      screen.getByText(/Disciplina não encontrada/i),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /Voltar para disciplinas/i }),
    );
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('exibe mensagem de não encontrado quando disciplina não existe', () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '999' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => undefined,
      updateSubject: jest.fn(),
    });

    render(<SubjectEditPage />);

    expect(
      screen.getByText(/Disciplina não encontrada/i),
    ).toBeInTheDocument();
  });

  it('preenche formulário com dados da disciplina existente', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '2' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 2,
        name: 'História',
        description: 'Estudo de eventos históricos.',
        workloadHours: 60,
      }),
      updateSubject: jest.fn(),
    });

    render(<SubjectEditPage />);

    expect(await screen.findByDisplayValue('História')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Estudo de eventos históricos.'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
  });

  it('valida nome obrigatório ao salvar', async () => {
    const updateSubjectMock = jest.fn();

    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '3' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 3,
        name: 'Biologia',
        description: 'Disciplina de ciências da vida.',
        workloadHours: 40,
      }),
      updateSubject: updateSubjectMock,
    });

    render(<SubjectEditPage />);

    const nameInput = await screen.findByLabelText(/Nome da disciplina/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    fireEvent.click(
      screen.getByRole('button', { name: /Salvar alterações/i }),
    );

    expect(
      screen.getByText(/O nome da disciplina é obrigatório/i),
    ).toBeInTheDocument();
    expect(updateSubjectMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('atualiza disciplina e redireciona ao salvar com dados válidos', async () => {
    const updateSubjectMock = jest.fn();

    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '4' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 4,
        name: 'Geografia',
        description: 'Antiga descrição',
        workloadHours: 30,
      }),
      updateSubject: updateSubjectMock,
    });

    render(<SubjectEditPage />);

    const nameInput = await screen.findByLabelText(/Nome da disciplina/i);
    const descriptionInput =
      screen.getByLabelText(/Descrição/i);
    const workloadInput = screen.getByLabelText(
      /Carga horária \(horas\)/i,
    );

    fireEvent.change(nameInput, {
      target: { value: 'Geografia Geral' },
    });
    fireEvent.change(descriptionInput, {
      target: { value: 'Nova descrição da disciplina.' },
    });
    fireEvent.change(workloadInput, { target: { value: '90' } });

    fireEvent.click(
      screen.getByRole('button', { name: /Salvar alterações/i }),
    );

    expect(updateSubjectMock).toHaveBeenCalledWith(
      4,
      expect.objectContaining({
        name: 'Geografia Geral',
        description: 'Nova descrição da disciplina.',
        workloadHours: 90,
      }),
    );
    expect(alertMock).toHaveBeenCalledWith(
      'Disciplina atualizada com sucesso!',
    );
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('volta para lista ao clicar em Cancelar', async () => {
    (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '5' });

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: () => ({
        id: 5,
        name: 'Artes',
        description: '',
        workloadHours: undefined,
      }),
      updateSubject: jest.fn(),
    });

    render(<SubjectEditPage />);

    const cancelBtn = await screen.findByRole('button', {
      name: /Cancelar/i,
    });
    fireEvent.click(cancelBtn);

    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
