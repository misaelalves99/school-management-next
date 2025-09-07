// src/app/classrooms/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DeleteClassRoomPage from "./page";
import * as nextNavigation from "next/navigation";
import { useClassRooms } from "@/app/hooks/useClassRooms";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/app/hooks/useClassRooms");

describe("DeleteClassRoomPage", () => {
  const pushMock = jest.fn();
  const deleteClassRoomMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;
  const useParamsMock = nextNavigation.useParams as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
    (useClassRooms as jest.Mock).mockReturnValue({
      classRooms: [
        {
          id: 1,
          name: "Sala 101",
          capacity: 30,
          schedule: "Seg-Qua 08:00-10:00",
          teachers: [],
          subjects: [],
          classTeacher: null,
        },
      ],
      deleteClassRoom: deleteClassRoomMock,
    });
  });

  it("exibe mensagem de ID inválido quando id está ausente ou inválido", () => {
    useParamsMock.mockReturnValue({});
    render(<DeleteClassRoomPage />);
    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();

    useParamsMock.mockReturnValue({ id: "abc" }); // não-numérico
    render(<DeleteClassRoomPage />);
    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();
  });

  it("exibe mensagem de turma não encontrada para id inexistente", () => {
    useParamsMock.mockReturnValue({ id: "999" });
    render(<DeleteClassRoomPage />);
    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it("renderiza detalhes da turma corretamente", () => {
    useParamsMock.mockReturnValue({ id: "1" });
    render(<DeleteClassRoomPage />);
    expect(screen.getByText("Excluir Turma")).toBeInTheDocument();
    expect(
      screen.getByText(/Tem certeza que deseja excluir/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Sala 101/i)).toBeInTheDocument();
  });

  it("botão Excluir chama deleteClassRoom e navega", () => {
    useParamsMock.mockReturnValue({ id: "1" });
    render(<DeleteClassRoomPage />);

    const form = screen.getByRole("form", { hidden: true }) ?? null;
    if (form) {
      const submitEvent = new Event("submit", { bubbles: true });
      const preventSpy = jest.spyOn(submitEvent, "preventDefault");
      form.dispatchEvent(submitEvent);
      expect(preventSpy).toHaveBeenCalled();
    }

    fireEvent.click(screen.getByRole("button", { name: /Excluir/i }));

    expect(deleteClassRoomMock).toHaveBeenCalledWith(1);
    expect(pushMock).toHaveBeenCalledWith("/classrooms");
  });

  it("botão Cancelar navega para lista de salas", () => {
    useParamsMock.mockReturnValue({ id: "1" });
    render(<DeleteClassRoomPage />);

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(pushMock).toHaveBeenCalledWith("/classrooms");
  });
});
