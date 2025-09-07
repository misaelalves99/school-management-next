// src/providers/ClassRoomsProvider.test.tsx

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ClassRoomsProvider } from './ClassRoomsProvider';
import { useClassRooms } from '../hooks/useClassRooms';
import { mockClassRooms } from '../mocks/classRooms';

// Componente auxiliar para testar o hook dentro do Provider
function TestComponent() {
  const {
    classRooms,
    getClassRoomById,
    createClassRoom,
    updateClassRoom,
    deleteClassRoom,
  } = useClassRooms();

  return (
    <div>
      <ul data-testid="classroom-list">
        {classRooms.map((c) => (
          <li key={c.id} data-testid="classroom-item">
            {c.name}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          createClassRoom({
            name: 'Nova Sala',
            capacity: 20,
            schedule: '08:00-10:00',
            subjects: [],
            teachers: [],
            classTeacher: null,
          })
        }
      >
        Criar Sala
      </button>

      <button
        onClick={() => {
          const id = classRooms[0]?.id;
          if (id)
            updateClassRoom(id, {
              ...classRooms[0],
              name: 'Sala Atualizada',
            });
        }}
      >
        Atualizar Sala
      </button>

      <button
        onClick={() => {
          const id = classRooms[0]?.id;
          if (id) deleteClassRoom(id);
        }}
      >
        Deletar Sala
      </button>

      <span data-testid="get-classroom">
        {getClassRoomById(classRooms[0]?.id ?? 0)?.name || 'Não encontrado'}
      </span>
    </div>
  );
}

describe('ClassRoomsProvider', () => {
  it('deve inicializar com mockClassRooms', () => {
    render(
      <ClassRoomsProvider>
        <TestComponent />
      </ClassRoomsProvider>
    );

    const items = screen.getAllByTestId('classroom-item');
    expect(items.length).toBe(mockClassRooms.length);
    mockClassRooms.forEach((room) => {
      expect(screen.getByText(room.name)).toBeInTheDocument();
    });
  });

  it('deve criar uma nova sala', () => {
    render(
      <ClassRoomsProvider>
        <TestComponent />
      </ClassRoomsProvider>
    );

    act(() => {
      screen.getByText('Criar Sala').click();
    });

    const list = screen.getAllByTestId('classroom-item');
    expect(list[list.length - 1]).toHaveTextContent('Nova Sala');
  });

  it('deve atualizar a sala existente', () => {
    render(
      <ClassRoomsProvider>
        <TestComponent />
      </ClassRoomsProvider>
    );

    act(() => {
      screen.getByText('Atualizar Sala').click();
    });

    expect(screen.getByTestId('get-classroom')).toHaveTextContent(
      'Sala Atualizada'
    );
  });

  it('deve deletar a sala existente', () => {
    render(
      <ClassRoomsProvider>
        <TestComponent />
      </ClassRoomsProvider>
    );

    act(() => {
      screen.getByText('Deletar Sala').click();
    });

    const list = screen.queryAllByTestId('classroom-item');
    expect(list.length).toBe(mockClassRooms.length - 1);
  });

  it('getClassRoomById retorna undefined para id inexistente', () => {
    render(
      <ClassRoomsProvider>
        <TestComponent />
      </ClassRoomsProvider>
    );

    expect(screen.getByTestId('get-classroom')).toBeInTheDocument();
  });
});
