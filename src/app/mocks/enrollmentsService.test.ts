// src/mocks/enrollmentsService.test.ts
import {
  getEnrollmentById,
  deleteEnrollment,
  updateEnrollment,
  addEnrollment,
} from './enrollmentsService';
import enrollments, { Enrollment } from './enrollments';

// Antes de cada teste, resetamos o mock para o estado inicial
let initialEnrollments: Enrollment[];

beforeEach(() => {
  // Faz uma cópia profunda do mock original
  initialEnrollments = JSON.parse(JSON.stringify(enrollments));
});

afterEach(() => {
  // Restaura o array original
  enrollments.length = 0;
  initialEnrollments.forEach(e => enrollments.push(e));
});

describe('enrollmentsService', () => {
  test('getEnrollmentById retorna a matrícula correta', () => {
    const firstEnrollment = enrollments[0];
    expect(getEnrollmentById(firstEnrollment.id)).toEqual(firstEnrollment);
    expect(getEnrollmentById(99999)).toBeUndefined(); // ID que não existe
  });

  test('deleteEnrollment remove matrícula existente e retorna true', () => {
    const idToDelete = enrollments[0].id;
    const result = deleteEnrollment(idToDelete);
    expect(result).toBe(true);
    expect(enrollments.find(e => e.id === idToDelete)).toBeUndefined();
  });

  test('deleteEnrollment retorna false se matrícula não existir', () => {
    const result = deleteEnrollment(99999);
    expect(result).toBe(false);
  });

  test('updateEnrollment atualiza matrícula existente e retorna true', () => {
    const updated = { ...enrollments[0], studentName: 'Novo Nome' };
    const result = updateEnrollment(updated);
    expect(result).toBe(true);
    expect(enrollments[0].studentName).toBe('Novo Nome');
  });

  test('updateEnrollment retorna false se matrícula não existir', () => {
    const result = updateEnrollment({ id: 99999, studentName: 'X', course: 'Y' });
    expect(result).toBe(false);
  });

  test('addEnrollment adiciona nova matrícula', () => {
    const newEnrollment: Enrollment = { id: 99999, studentName: 'Teste', course: 'Curso Teste' };
    addEnrollment(newEnrollment);
    expect(enrollments).toContainEqual(newEnrollment);
  });
});
