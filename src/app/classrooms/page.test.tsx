// src/app/classrooms/page.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ClassroomsPage from './page';
import * as nextNavigation from 'next/navigation';
import mockClassRooms from '../mocks/classRooms';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ClassroomsPage', () => {
  const pushMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
  });

  it('deve renderizar título, formulário de busca e botão de cadastro', () => {
    render(<ClassroomsPage />);
    expect(screen.getByText(/Buscar Salas/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite o nome ou capacidade/i)).toBeInTheDocument();
    expect(screen.getByText(/Cadastrar Nova Sala/i)).toBeInTheDocument();
  });

  it('deve renderizar a tabela com os dados da primeira página', () => {
    render(<ClassroomsPage />);
    mockClassRooms.slice(0, 2).forEach((room) => {
      expect(screen.getByText(room.name)).toBeInTheDocument();
      expect(screen.getByText(String(room.capacity))).toBeInTheDocument();
    });
  });

  it('botão de cadastro deve chamar router.push("/classrooms/create")', () => {
    render(<ClassroomsPage />);
    fireEvent.click(screen.getByText(/Cadastrar Nova Sala/i));
    expect(pushMock).toHaveBeenCalledWith('/classrooms/create');
  });

  it('botões de ação devem chamar router.push com o caminho correto', () => {
    render(<ClassroomsPage />);
    const firstRoom = mockClassRooms[0];

    fireEvent.click(screen.getAllByText(/Editar/i)[0]);
    expect(pushMock).toHaveBeenCalledWith(`/classrooms/edit/${firstRoom.id}`);

    fireEvent.click(screen.getAllByText(/Detalhes/i)[0]);
    expect(pushMock).toHaveBeenCalledWith(`/classrooms/details/${firstRoom.id}`);

    fireEvent.click(screen.getAllByText(/Excluir/i)[0]);
    expect(pushMock).toHaveBeenCalledWith(`/classrooms/delete/${firstRoom.id}`);
  });

  it('deve filtrar resultados ao buscar', () => {
    render(<ClassroomsPage />);
    const searchInput = screen.getByPlaceholderText(/Digite o nome ou capacidade/i);
    const searchButton = screen.getByText(/Buscar/i);

    fireEvent.change(searchInput, { target: { value: 'Sala A' } });
    fireEvent.click(searchButton);

    expect(screen.getByText('Sala A')).toBeInTheDocument();
    // Deve esconder outras salas não correspondentes
    mockClassRooms
      .filter((c) => c.name !== 'Sala A')
      .forEach((c) => {
        expect(screen.queryByText(c.name)).not.toBeInTheDocument();
      });
  });

  it('deve navegar entre páginas usando os botões de paginação', () => {
    render(<ClassroomsPage />);
    const nextButton = screen.getByText(/Próxima/i);
    fireEvent.click(nextButton);

    // Na segunda página, deve aparecer a terceira sala se existir
    if (mockClassRooms.length > 2) {
      expect(screen.getByText(mockClassRooms[2].name)).toBeInTheDocument();
    }

    const prevButton = screen.getByText(/Anterior/i);
    fireEvent.click(prevButton);
    expect(screen.getByText(mockClassRooms[0].name)).toBeInTheDocument();
  });
});
