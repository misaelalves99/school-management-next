// src/app/contexts/EnrollmentsProvider.test.tsx

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { EnrollmentsProvider } from './EnrollmentsProvider';
import { useEnrollments } from '../hooks/useEnrollments';
import type { EnrollmentWithNames } from '../types/Enrollment';
import { mockEnrollmentsWithNames as enrollmentsMock } from '../mocks/enrollments';

// Componente auxiliar para testar o hook dentro do Provider
function TestComponent() {
  const { enrollments, addEnrollment, updateEnrollment, deleteEnrollment } = useEnrollments();

  return (
    <div>
      <ul data-testid="enrollment-list">
        {enrollments.map((e) => (
          <li key={e.id} data-testid="enrollment-item">{e.studentName}</li>
        ))}
      </ul>

      <button
        onClick={() =>
          addEnrollment({
            id: 999,
            studentId: 999,
            classRoomId: 99,
            enrollmentDate: '2025-09-02',
            status: 'active',
            studentName: 'Novo Aluno',
            classRoomName: 'Sala X',
          } as EnrollmentWithNames)
        }
      >
        Adicionar Matrícula
      </button>

      <button
        onClick={() => {
          const first = enrollments[0];
          if (first)
            updateEnrollment({ ...first, studentName: 'Aluno Atualizado' } as EnrollmentWithNames);
        }}
      >
        Atualizar Matrícula
      </button>

      <button
        onClick={() => {
          const first = enrollments[0];
          if (first) deleteEnrollment(first.id);
        }}
      >
        Deletar Matrícula
      </button>
    </div>
  );
}

describe('EnrollmentsProvider', () => {
  it('deve inicializar com enrollmentsMock', () => {
    render(
      <EnrollmentsProvider>
        <TestComponent />
      </EnrollmentsProvider>
    );

    const items = screen.getAllByTestId('enrollment-item');
    expect(items.length).toBe(enrollmentsMock.length);

    enrollmentsMock.forEach((e) => {
      expect(screen.getByText(e.studentName)).toBeInTheDocument();
    });
  });

  it('deve adicionar uma nova matrícula', () => {
    render(
      <EnrollmentsProvider>
        <TestComponent />
      </EnrollmentsProvider>
    );

    act(() => {
      screen.getByText('Adicionar Matrícula').click();
    });

    const items = screen.getAllByTestId('enrollment-item');
    expect(items[items.length - 1]).toHaveTextContent('Novo Aluno');
  });

  it('deve atualizar a primeira matrícula', () => {
    render(
      <EnrollmentsProvider>
        <TestComponent />
      </EnrollmentsProvider>
    );

    act(() => {
      screen.getByText('Atualizar Matrícula').click();
    });

    expect(screen.getByText('Aluno Atualizado')).toBeInTheDocument();
  });

  it('deve deletar a primeira matrícula', () => {
    render(
      <EnrollmentsProvider>
        <TestComponent />
      </EnrollmentsProvider>
    );

    const firstName = enrollmentsMock[0].studentName;

    act(() => {
      screen.getByText('Deletar Matrícula').click();
    });

    expect(screen.queryByText(firstName)).not.toBeInTheDocument();
  });
});
