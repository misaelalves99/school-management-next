// src/app/classrooms/details/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import ClassRoomDetailsPage from "./page";
import * as nextNavigation from "next/navigation";
import { useClassRooms } from "@/app/hooks/useClassRooms";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/app/hooks/useClassRooms");

describe("ClassRoomDetailsPage", () => {
  const pushMock = jest.fn();
  const useRouterMock = nextNavigation.useRouter as jest.Mock;
  const useParamsMock = nextNavigation.useParams as jest.Mock;
  const getClassRoomByIdMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
    (useClassRooms as jest.Mock).mockReturnValue({
      getClassRoomById: getClassRoomByIdMock,
    });
  });

  it("renderiza mensagem de turma não encontrada se id inválido", () => {
    useParamsMock.mockReturnValue({ id: "999" });
    getClassRoomByIdMock.mockReturnValue(undefined);

    render(<ClassRoomDetailsPage />);
    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Voltar à Lista/i })
    ).toBeInTheDocument();
  });

  it("renderiza detalhes da turma corretamente", () => {
    const classRoom = {
      id: 1,
      name: "Sala 101",
      capacity: 30,
      schedule: "Seg-Qua 08:00-10:00",
    };
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<ClassRoomDetailsPage />);

    expect(screen.getByText(/Detalhes da Turma/i)).toBeInTheDocument();
    expect(screen.getByText(classRoom.name)).toBeInTheDocument();
    expect(screen.getByText(String(classRoom.capacity))).toBeInTheDocument();
    expect(screen.getByText(classRoom.schedule)).toBeInTheDocument();
  });

  it("botão Editar chama router.push com a rota correta", () => {
    const classRoom = {
      id: 1,
      name: "Sala 101",
      capacity: 30,
      schedule: "Seg-Qua 08:00-10:00",
    };
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<ClassRoomDetailsPage />);

    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));
    expect(pushMock).toHaveBeenCalledWith(`/classrooms/edit/${classRoom.id}`);
  });

  it("botão Voltar à Lista chama router.push para /classrooms", () => {
    const classRoom = {
      id: 1,
      name: "Sala 101",
      capacity: 30,
      schedule: "Seg-Qua 08:00-10:00",
    };
    useParamsMock.mockReturnValue({ id: String(classRoom.id) });
    getClassRoomByIdMock.mockReturnValue(classRoom);

    render(<ClassRoomDetailsPage />);

    fireEvent.click(screen.getByRole("button", { name: /Voltar à Lista/i }));
    expect(pushMock).toHaveBeenCalledWith("/classrooms");
  });
});
