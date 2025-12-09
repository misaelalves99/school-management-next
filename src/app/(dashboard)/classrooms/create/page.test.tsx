// src/app/(dashboard)/classrooms/create/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ClassRoomCreatePage from './page.jsx';
import { useClassRooms } from '@/core/hooks/useClassRooms.js';

jest.mock('@/core/hooks/useClassRooms');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ClassRoomCreatePage (dashboard)', () => {
  const createClassRoomMock = jest.fn();
  const pushMock = jest.fn();
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();

    (useClassRooms as jest.Mock).mockReturnValue({
      classRooms: [],
      createClassRoom: createClassRoomMock,
    });

    (require('next/navigation') as any).useRouter = () => ({
      push: pushMock,
    });
  });

  it('renderiza os campos principais do formulário', () => {
    render(<ClassRoomCreatePage />);

    expect(screen.getByLabelText(/Nome da turma/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Horário \/ turno/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Capacidade máxima de alunos/i),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Salvar turma/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  it('exibe mensagens de erro quando campos obrigatórios estão vazios', () => {
    render(<ClassRoomCreatePage />);

    fireEvent.click(screen.getByRole('button', { name: /Salvar turma/i }));

    expect(
      screen.getByText(/Nome da turma é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Horário\/turno é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Capacidade é obrigatória/i),
    ).toBeInTheDocument();
    expect(createClassRoomMock).not.toHaveBeenCalled();
  });

  it('valida capacidade com valor inválido', () => {
    render(<ClassRoomCreatePage />);

    fireEvent.change(screen.getByLabelText(/Nome da turma/i), {
      target: { value: '1º Ano A' },
    });
    fireEvent.change(screen.getByLabelText(/Horário \/ turno/i), {
      target: { value: 'Manhã (07:00 - 11:30)' },
    });
    fireEvent.change(
      screen.getByLabelText(/Capacidade máxima de alunos/i),
      {
        target: { value: '0' },
      },
    );

    fireEvent.click(screen.getByRole('button', { name: /Salvar turma/i }));

    expect(
      screen.getByText(/Informe um número de alunos maior que zero/i),
    ).toBeInTheDocument();
    expect(createClassRoomMock).not.toHaveBeenCalled();
  });

  it('chama createClassRoom com dados corretos quando formulário é válido', () => {
    render(<ClassRoomCreatePage />);

    fireEvent.change(screen.getByLabelText(/Nome da turma/i), {
      target: { value: '1º Ano A' },
    });
    fireEvent.change(screen.getByLabelText(/Horário \/ turno/i), {
      target: { value: 'Manhã (07:00 - 11:30)' },
    });
    fireEvent.change(
      screen.getByLabelText(/Capacidade máxima de alunos/i),
      {
        target: { value: '30' },
      },
    );

    fireEvent.click(screen.getByRole('button', { name: /Salvar turma/i }));

    expect(createClassRoomMock).toHaveBeenCalledWith({
      name: '1º Ano A',
      schedule: 'Manhã (07:00 - 11:30)',
      capacity: 30,
    });
    expect(alertMock).toHaveBeenCalledWith('Turma criada com sucesso!');
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });

  it('botão Cancelar navega de volta para a lista', () => {
    render(<ClassRoomCreatePage />);

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith('/classrooms');
  });
});
