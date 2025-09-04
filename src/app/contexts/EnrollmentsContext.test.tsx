// src/app/contexts/EnrollmentsContext.test.tsx

import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { EnrollmentsContext, type EnrollmentsContextType } from './EnrollmentsContext';
import type { EnrollmentWithNames } from '../types/Enrollment';

// Componente de teste para verificar o contexto
function TestComponent() {
  const context = useContext(EnrollmentsContext);

  if (!context) return <div data-testid="no-context">Contexto não disponível</div>;

  const { enrollments, addEnrollment, updateEnrollment, deleteEnrollment } = context;

  return (
    <div>
      <span data-testid="enrollments-length">{enrollments.length}</span>
      <span data-testid="has-add">{typeof addEnrollment === 'function' ? 'ok' : 'fail'}</span>
      <span data-testid="has-update">{typeof updateEnrollment === 'function' ? 'ok' : 'fail'}</span>
      <span data-testid="has-delete">{typeof deleteEnrollment === 'function' ? 'ok' : 'fail'}</span>
    </div>
  );
}

describe('EnrollmentsContext', () => {
  it('deve fornecer undefined quando não há provider', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('no-context')).toHaveTextContent('Contexto não disponível');
  });

  it('deve fornecer valores quando o provider é usado', () => {
    const mockContext: EnrollmentsContextType = {
      enrollments: [] as EnrollmentWithNames[],
      addEnrollment: jest.fn(),
      updateEnrollment: jest.fn(),
      deleteEnrollment: jest.fn(),
    };

    render(
      <EnrollmentsContext.Provider value={mockContext}>
        <TestComponent />
      </EnrollmentsContext.Provider>
    );

    expect(screen.getByTestId('enrollments-length')).toHaveTextContent('0');
    expect(screen.getByTestId('has-add')).toHaveTextContent('ok');
    expect(screen.getByTestId('has-update')).toHaveTextContent('ok');
    expect(screen.getByTestId('has-delete')).toHaveTextContent('ok');
  });
});
