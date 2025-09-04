// src/contexts/ClassRoomsContext.test.tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ClassRoomsProvider } from './ClassRoomsProvider'; // <-- Provider separado
import { useClassRooms } from '../hooks/useClassRooms';
import type { ClassRoom } from '../types/Classroom';

// Componente auxiliar para testar o hook dentro do Provider
function TestComponent() {
  const { classRooms, getClassRoomById, createClassRoom, updateClassRoom, deleteClassRoom } = useClassRooms();

  return (
    <div>
      <ul data-testid="classroom-list">
        {classRooms.map((c: ClassRoom) => (
          <li key={c.id} data-testid="classroom-item">{c.name}</li>
        ))}
      </ul>

      <button onClick={() => createClassRoom({ name: 'Nova Sala', capacity: 20, schedule: '08:00-10:00', subjects: [], teachers: [], classTeacher: null })}>
        Criar Sala
      </button>

      <button onClick={() => {
        const id = classRooms[0]?.id;
        if (id) updateClassRoom(id, { ...classRooms[0], name: 'Sala Atualizada' });
      }}>
        Atualizar Sala
      </button>

      <button onClick={() => {
        const id = classRooms[0]?.id;
        if (id) deleteClassRoom(id);
      }}>
        Deletar Sala
      </button>

      <span data-testid="get-classroom">
        {getClassRoomById(classRooms[0]?.id ?? 0)?.name || 'Não encontrado'}
      </span>
    </div>
  );
}

describe('ClassRoomsContext', () => {
  it('fornece valores iniciais e permite criar, atualizar e deletar salas', () => {
    render(
      <ClassRoomsProvider>
        <TestComponent />
      </ClassRoomsProvider>
    );

    const list = screen.getByTestId('classroom-list');
    expect(list.children.length).toBe(0);

    // Criar uma sala
    act(() => {
      screen.getByText('Criar Sala').click();
    });
    expect(list.children.length).toBe(1);
    expect(screen.getByTestId('get-classroom')).toHaveTextContent('Nova Sala');

    // Atualizar a sala
    act(() => {
      screen.getByText('Atualizar Sala').click();
    });
    expect(screen.getByTestId('get-classroom')).toHaveTextContent('Sala Atualizada');

    // Deletar a sala
    act(() => {
      screen.getByText('Deletar Sala').click();
    });
    expect(list.children.length).toBe(0);
    expect(screen.getByTestId('get-classroom')).toHaveTextContent('Não encontrado');
  });

  it('getClassRoomById retorna undefined para IDs inexistentes', () => {
    render(
      <ClassRoomsProvider>
        <TestComponent />
      </ClassRoomsProvider>
    );
    const span = screen.getByTestId('get-classroom');
    expect(span).toHaveTextContent('Não encontrado');
  });
});
