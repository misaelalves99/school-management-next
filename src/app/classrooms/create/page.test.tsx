// src/app/classrooms/create/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useClassRooms } from "@/app/hooks/useClassRooms";
import ClassRoomCreate from "./page";

const pushMock = jest.fn();
const createClassRoomMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock("@/app/hooks/useClassRooms", () => ({
  useClassRooms: jest.fn(),
}));

describe("ClassRoomCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useClassRooms as jest.Mock).mockReturnValue({
      createClassRoom: createClassRoomMock,
    });
  });

  it("renderiza o formulário corretamente", () => {
    render(<ClassRoomCreate />);
    expect(screen.getByText("Cadastrar Nova Sala")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Capacidade")).toBeInTheDocument();
    expect(screen.getByLabelText("Horário")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("mostra erros de validação ao tentar salvar vazio", () => {
    render(<ClassRoomCreate />);

    fireEvent.click(screen.getByText("Salvar"));

    expect(screen.getByText("Nome é obrigatório.")).toBeInTheDocument();
    expect(
      screen.getByText("Capacidade deve ser entre 1 e 100.")
    ).toBeInTheDocument();
    expect(screen.getByText("Horário é obrigatório.")).toBeInTheDocument();
    expect(createClassRoomMock).not.toHaveBeenCalled();
  });

  it("mostra erro se capacidade for inválida", () => {
    render(<ClassRoomCreate />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Sala A" },
    });
    fireEvent.change(screen.getByLabelText("Capacidade"), {
      target: { value: "200" },
    });
    fireEvent.change(screen.getByLabelText("Horário"), {
      target: { value: "Segunda 08:00-10:00" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(
      screen.getByText("Capacidade deve ser entre 1 e 100.")
    ).toBeInTheDocument();
    expect(createClassRoomMock).not.toHaveBeenCalled();
  });

  it("chama createClassRoom com dados válidos e navega", () => {
    render(<ClassRoomCreate />);

    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Sala A" },
    });
    fireEvent.change(screen.getByLabelText("Capacidade"), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText("Horário"), {
      target: { value: "Seg-Qua 08:00-10:00" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(createClassRoomMock).toHaveBeenCalledWith({
      name: "Sala A",
      capacity: 30,
      schedule: "Seg-Qua 08:00-10:00",
      subjects: [],
      teachers: [],
      classTeacher: null,
    });
    expect(pushMock).toHaveBeenCalledWith("/classrooms");
  });

  it("navega para /classrooms ao clicar em Cancelar", () => {
    render(<ClassRoomCreate />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(pushMock).toHaveBeenCalledWith("/classrooms");
  });
});
