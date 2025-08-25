// src/mocks/enrollments.test.ts
import { mockEnrollments, type Enrollment } from './enrollments';

describe('mockEnrollments', () => {
  it('deve ser um array de enrollments', () => {
    expect(Array.isArray(mockEnrollments)).toBe(true);
    mockEnrollments.forEach((enrollment: Enrollment) => {
      expect(enrollment).toHaveProperty('id');
      expect(enrollment).toHaveProperty('studentId');
      expect(enrollment).toHaveProperty('classRoomId');
      expect(enrollment).toHaveProperty('enrollmentDate');
      expect(enrollment).toHaveProperty('status');
    });
  });

  it('cada enrollment deve ter ids numéricos válidos', () => {
    mockEnrollments.forEach((enrollment: Enrollment) => {
      expect(typeof enrollment.id).toBe('number');
      expect(typeof enrollment.studentId).toBe('number');
      expect(typeof enrollment.classRoomId).toBe('number');
    });
  });

  it('cada enrollment deve ter data válida e status definido', () => {
    mockEnrollments.forEach((enrollment: Enrollment) => {
      const date = new Date(enrollment.enrollmentDate);
      expect(date.toString()).not.toBe('Invalid Date');
      expect(typeof enrollment.status).toBe('string');
      expect(enrollment.status.length).toBeGreaterThan(0);
    });
  });

  it('deve permitir adição de novos enrollments mantendo o formato', () => {
    const newEnrollment: Enrollment = {
      id: mockEnrollments.length + 1,
      studentId: 3,
      classRoomId: 1,
      enrollmentDate: '2025-03-01',
      status: 'Ativo',
    };
    mockEnrollments.push(newEnrollment);
    expect(mockEnrollments[mockEnrollments.length - 1]).toEqual(newEnrollment);
  });
});
