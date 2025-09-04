// src/mocks/enrollments.test.ts

import mockEnrollments from './enrollments';
import type { Enrollment } from './enrollments';

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
    const initialLength = mockEnrollments.length;

    const newEnrollment: Enrollment = {
      id: initialLength + 1,
      studentId: 3,
      classRoomId: 1,
      enrollmentDate: '2025-03-01',
      status: 'Ativo',
    };

    mockEnrollments.push(newEnrollment);
    const last = mockEnrollments[mockEnrollments.length - 1];

    expect(mockEnrollments.length).toBe(initialLength + 1);
    expect(last).toEqual(newEnrollment);
  });

  it('não deve modificar outros enrollments ao adicionar novo', () => {
    const snapshot = [...mockEnrollments];
    const newEnrollment: Enrollment = {
      id: snapshot.length + 1,
      studentId: 4,
      classRoomId: 2,
      enrollmentDate: '2025-04-01',
      status: 'Ativo',
    };
    mockEnrollments.push(newEnrollment);

    snapshot.forEach((enrollment, index) => {
      expect(mockEnrollments[index]).toEqual(enrollment);
    });
  });
});
