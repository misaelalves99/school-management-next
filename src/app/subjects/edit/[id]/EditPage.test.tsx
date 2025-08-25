// src/app/subjects/edit/[id]/EditPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EditSubjectPage from './page';
import { mockSubjects } from '../../../mocks/subjects';
import * as nextRouter from 'next/navigation';

describe('EditSubjectPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({ push: pushMock } as any);
    pushMock.mockClear();
  });

  it('preenche formulário com dados da disciplina existente', () => {
    const subject = mockSubjects[0];
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subject.id) });

    render(<EditSubjectPage />);
    expect(screen.getByDisplayValue(subject.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(subject.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(String(subject.workloadHours))).toBeInTheDocument();
  });

  it('mostra erro se campo nome estiver vazio ao submeter', () => {
    const subject = mockSubjects[0];
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subject.id) });

    render(<EditSubjectPage />);
    const nameInput = screen.getByLabelText(/nome da disciplina/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));
    expect(screen.getByText(/o nome da disciplina é obrigatório/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submete formulário corretamente quando nome preenchido', () => {
    const subject = mockSubjects[0];
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subject.id) });

    render(<EditSubjectPage />);
    const nameInput = screen.getByLabelText(/nome da disciplina/i);
    fireEvent.change(nameInput, { target: { value: 'Nova Disciplina' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));
    expect(screen.queryByText(/o nome da disciplina é obrigatório/i)).not.toBeInTheDocument();
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('botão Voltar à Lista redireciona corretamente', () => {
    const subject = mockSubjects[0];
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subject.id) });

    render(<EditSubjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /voltar à lista/i }));
    expect(pushMock).toHaveBeenCalledWith('/subjects');
  });

  it('atualiza campos description e workloadHours corretamente', () => {
    const subject = mockSubjects[0];
    jest.spyOn(nextRouter, 'useParams').mockReturnValue({ id: String(subject.id) });

    render(<EditSubjectPage />);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    const workloadInput = screen.getByLabelText(/carga horária/i);

    fireEvent.change(descriptionInput, { target: { value: 'Nova descrição' } });
    fireEvent.change(workloadInput, { target: { value: '80' } });

    expect(screen.getByDisplayValue('Nova descrição')).toBeInTheDocument();
    expect(screen.getByDisplayValue('80')).toBeInTheDocument();
  });
});
