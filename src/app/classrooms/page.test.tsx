// src/app/classrooms/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import ClassroomsPage from "./page";
import { useClassRooms } from "../hooks/useClassRooms";
import { mockClassRooms } from "../mocks/classRooms";

jest.mock("../hooks/useClassRooms");

describe("ClassroomsPage", () => {
  beforeEach(() => {
    (useClassRooms as jest.Mock).mockReturnValue({
      classRooms: mockClassRooms,
    });
  });

  it("deve renderizar a lista de salas", () => {
    render(<ClassroomsPage />);

    expect(screen.getByText("Lista de Salas")).toBeInTheDocument();
    expect(screen.getByText(mockClassRooms[0].name)).toBeInTheDocument();
  });

  it("deve filtrar as salas pelo nome", () => {
    render(<ClassroomsPage />);

    const input = screen.getByPlaceholderText(/Digite nome, horário ou capacidade/i);
    fireEvent.change(input, { target: { value: mockClassRooms[0].name } });

    expect(screen.getByText(mockClassRooms[0].name)).toBeInTheDocument();
    expect(screen.queryByText(mockClassRooms[1].name)).not.toBeInTheDocument();
  });

  it("deve exibir mensagem quando não houver resultados", () => {
    render(<ClassroomsPage />);

    const input = screen.getByPlaceholderText(/Digite nome, horário ou capacidade/i);
    fireEvent.change(input, { target: { value: "Inexistente" } });

    expect(screen.getByText(/Nenhuma sala encontrada/i)).toBeInTheDocument();
  });

  it("deve ter link para cadastrar nova sala", () => {
    render(<ClassroomsPage />);

    const link = screen.getByRole("link", { name: /Cadastrar Nova Sala/i });
    expect(link).toHaveAttribute("href", "/classrooms/create");
  });

  it("cada sala deve ter links de ações", () => {
    render(<ClassroomsPage />);

    const room = mockClassRooms[0];

    expect(
      screen.getByRole("link", { name: /Detalhes/i })
    ).toHaveAttribute("href", `/classrooms/details/${room.id}`);

    expect(
      screen.getByRole("link", { name: /Editar/i })
    ).toHaveAttribute("href", `/classrooms/edit/${room.id}`);

    expect(
      screen.getByRole("link", { name: /Excluir/i })
    ).toHaveAttribute("href", `/classrooms/delete/${room.id}`);
  });
});
