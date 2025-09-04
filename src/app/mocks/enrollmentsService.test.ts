// src/mocks/enrollmentsService.test.ts

import {
  getEnrollmentById,
  deleteEnrollment,
  updateEnrollment,
  addEnrollment,
} from './enrollmentsService';
import enrollments, { type Enrollment } from './enrollments';

// Cópia do estado inicial do mock antes de cada teste
let initialEnrollments: Enrollment[];

beforeEach(() => {
  initialEnrollments = JSON.parse(JSON.stringify(enrollments));
});

afterEach(() => {
  enrollments.length = 0;
  initialEnrollments.forEach(e => enrollments.push(e));
});

describe('enrollmentsService', () => {
  it('getEnrollmentById retorna a matrícula correta', () => {
    const firstEnrollment = enrollments[0];
    expect(getEnrollmentById(firstEnrollment.id)).toEqual(firstEnrollment);
    expect(getEnrollmentById(99999)).toBeUndefined();
  });

  it('deleteEnrollment remove matrícula existente e retorna true', () => {
    const idToDelete = enrollments[0].id;
    const result = deleteEnrollment(idToDelete);
    expect(result).toBe(true);
    expect(enrollments.find(e => e.id === idToDelete)).toBeUndefined();
  });

  it('deleteEnrollment retorna false se matrícula não existir', () => {
    const result = deleteEnrollment(99999);
    expect(result).toBe(false);
  });

  it('updateEnrollment atualiza matrícula existente e retorna true', () => {
    const updated: Enrollment = { ...enrollments[0], status: 'Inativo' };
    const result = updateEnrollment(updated);
    expect(result).toBe(true);
    expect(enrollments[0].status).toBe('Inativo');
  });

  it('updateEnrollment retorna false se matrícula não existir', () => {
    const result = updateEnrollment({
      id: 99999,
      studentId: 1,
      classRoomId: 1,
      enrollmentDate: '2025-01-01',
      status: 'Ativo',
    });
    expect(result).toBe(false);
  });

  it('addEnrollment adiciona nova matrícula', () => {
    const newEnrollment: Enrollment = {
      id: 99999,
      studentId: 5,
      classRoomId: 2,
      enrollmentDate: '2025-06-01',
      status: 'Ativo',
    };
    addEnrollment(newEnrollment);
    expect(enrollments).toContainEqual(newEnrollment);
  });
});
