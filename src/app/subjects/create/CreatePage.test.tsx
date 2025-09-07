// src/app/subjects/create/CreatePage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateSubjectPage from './page';
import * as nextRouter from 'next/navigation';
import * as useSubjectsHook from '../../hooks/useSubjects';

describe('CreateSubjectPage', () => {
  const pushMock = jest.fn();
  const createSubjectMock = jest.fn();
  const alertMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      createSubject: createSubjectMock,
      subjects: [],
    } as any);
    jest.spyOn(window, 'alert').mockImplementation(alertMock);

    pushMock.mockClear();
    createSubjectMock.mockClear();
    alertMock.mockClear();
  });

  it('renderiza título e campos do formulário', () => {
    render(<CreateSubjectPage />);
    expect(screen.getByRole('heading', { name: /cadastrar nova disciplina/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da disciplina/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/carga horária/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('mostra erro se o campo nome estiver vazio ao submeter', async () => {
    render(<CreateSubjectPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /salvar/i }));
    expect(screen.getByText(/o nome da disciplina é obrigatório/i)).toBeInTheDocument();
    expect(createSubjectMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submete o formulário corretamente quando nome preenchido', async () => {
    render(<CreateSubjectPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/nome da disciplina/i);
    const descInput = screen.getByLabelText(/descrição/i);
    const workloadInput = screen.getByLabelText(/carga horária/i);

    await user.type(nameInput, 'Matemática');
    await user.type(descInput, 'Álgebra e Geometria');
    await user.clear(workloadInput);
    await user.type(workloadInput, '80');

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(createSubjectMock).toHaveBeenCalledWith({
      name: 'Matemática',
      description: 'Álgebra e Geometria',
      workloadHours: 80,
    });
    expect(alertMock).toHaveBeenCalledWith('Disciplina cadastrada com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('permite submeter com descrição ou carga horária vazias', async () => {
    render(<CreateSubjectPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/nome da disciplina/i);

    await user.type(nameInput, 'Física');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(createSubjectMock).toHaveBeenCalledWith({
      name: 'Física',
      description: '',
      workloadHours: 0,
    });
    expect(alertMock).toHaveBeenCalledWith('Disciplina cadastrada com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Cancelar redireciona corretamente', async () => {
    render(<CreateSubjectPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });
});
