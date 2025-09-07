// src/app/classrooms/[id]/edit/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditClassRoomPage from "./page";
import * as nextNavigation from "next/navigation";
import { useClassRooms } from "@/app/hooks/useClassRooms";
import { mockClassRooms } from "../../../mocks/classRooms";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/useClassRooms");

describe("EditClassRoomPage", () => {
  const pushMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;
  const updateClassRoomMock = jest.fn();
  const getClassRoomByIdMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: getClassRoomByIdMock,
      updateClassRoom: updateClassRoomMock,
    });
  });

  it("deve alertar e redirecionar se a sala não existir", async () => {
    window.alert = jest.fn();
    getClassRoomByIdMock.mockReturnValue(undefined);

    render(<EditClassRoomPage params={{ id: "999" }} />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Sala não encontrada");
      expect(pushMock).toHaveBeenCalledWith("/classrooms");
    });
  });

  it("deve renderizar o formulário com dados da sala existente", async () => {
    const classRoom = mockClassRooms[0];
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<EditClassRoomPage params={{ id: String(classRoom.id) }} />);

    expect(await screen.findByDisplayValue(classRoom.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(String(classRoom.capacity))).toBeInTheDocument();
    expect(screen.getByDisplayValue(classRoom.schedule)).toBeInTheDocument();
  });

  it("deve atualizar os valores ao alterar os inputs", async () => {
    const classRoom = mockClassRooms[0];
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<EditClassRoomPage params={{ id: String(classRoom.id) }} />);

    const nameInput = await screen.findByLabelText(/Nome/i);
    const capacityInput = screen.getByLabelText(/Capacidade/i);
    const scheduleInput = screen.getByLabelText(/Horário/i);

    fireEvent.change(nameInput, { target: { value: "Nova Sala" } });
    fireEvent.change(capacityInput, { target: { value: "42" } });
    fireEvent.change(scheduleInput, { target: { value: "08:00 - 12:00" } });

    expect(nameInput).toHaveValue("Nova Sala");
    expect(capacityInput).toHaveValue(42);
    expect(scheduleInput).toHaveValue("08:00 - 12:00");
  });

  it("deve chamar updateClassRoom e redirecionar ao salvar", async () => {
    const classRoom = mockClassRooms[0];
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<EditClassRoomPage params={{ id: String(classRoom.id) }} />);

    const nameInput = await screen.findByLabelText(/Nome/i);
    fireEvent.change(nameInput, { target: { value: "Sala Atualizada" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar Alterações/i }));

    expect(updateClassRoomMock).toHaveBeenCalledWith(
      classRoom.id,
      expect.objectContaining({
        name: "Sala Atualizada",
      })
    );
    expect(pushMock).toHaveBeenCalledWith("/classrooms");
  });

  it("botão Voltar deve redirecionar para /classrooms", async () => {
    const classRoom = mockClassRooms[0];
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<EditClassRoomPage params={{ id: String(classRoom.id) }} />);

    fireEvent.click(screen.getByRole("button", { name: /Voltar à Lista/i }));
    expect(pushMock).toHaveBeenCalledWith("/classrooms");
  });
});
