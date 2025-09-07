// src/app/subjects/edit/[id]/EditPage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditSubjectPage from './page';
import { mockSubjects } from '../../../mocks/subjects';
import * as nextRouter from 'next/navigation';
import * as useSubjectsHook from '../../../hooks/useSubjects';

describe('EditSubjectPage', () => {
  const pushMock = jest.fn();
  const updateSubjectMock = jest.fn();
  const subject = mockSubjects[0];

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();
    updateSubjectMock.mockClear();
  });

  const setupMocks = (id: string, getSubjectByIdImpl = (id: number) => (id === subject.id ? subject : undefined)) => {
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id });
    jest.spyOn(useSubjectsHook, 'useSubjects').mockReturnValue({
      getSubjectById: getSubjectByIdImpl,
      updateSubject: updateSubjectMock,
    } as any);
  };

  it('preenche formulário com dados da disciplina existente', () => {
    setupMocks(String(subject.id));
    render(<EditSubjectPage />);

    expect(screen.getByDisplayValue(subject.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(subject.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(String(subject.workloadHours))).toBeInTheDocument();
  });

  it('mostra erro se nome estiver vazio ao submeter', async () => {
    setupMocks(String(subject.id));
    render(<EditSubjectPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/nome da disciplina/i);
    await user.clear(nameInput);

    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

    expect(screen.getByText(/o nome da disciplina é obrigatório/i)).toBeInTheDocument();
    expect(updateSubjectMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submete formulário corretamente quando nome preenchido', async () => {
    setupMocks(String(subject.id));
    render(<EditSubjectPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/nome da disciplina/i);
    const descInput = screen.getByLabelText(/descrição/i);
    const workloadInput = screen.getByLabelText(/carga horária/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Nova Disciplina');
    await user.clear(descInput);
    await user.type(descInput, 'Nova descrição');
    await user.clear(workloadInput);
    await user.type(workloadInput, '80');

    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

    expect(updateSubjectMock).toHaveBeenCalledWith(subject.id, expect.objectContaining({
      name: 'Nova Disciplina',
      description: 'Nova descrição',
      workloadHours: 80,
    }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Voltar à Lista redireciona corretamente', async () => {
    setupMocks(String(subject.id));
    render(<EditSubjectPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /voltar à lista/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('mostra mensagem quando disciplina não encontrada', async () => {
    setupMocks('999', () => undefined);
    render(<EditSubjectPage />);
    const user = userEvent.setup();

    expect(screen.getByText(/disciplina não encontrada/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /voltar à lista/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('atualiza campos description e workloadHours corretamente', async () => {
    setupMocks(String(subject.id));
    render(<EditSubjectPage />);
    const user = userEvent.setup();

    const descInput = screen.getByLabelText(/descrição/i);
    const workloadInput = screen.getByLabelText(/carga horária/i);

    await user.clear(descInput);
    await user.type(descInput, 'Descrição Atualizada');
    await user.clear(workloadInput);
    await user.type(workloadInput, '100');

    expect(screen.getByDisplayValue('Descrição Atualizada')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });
});
