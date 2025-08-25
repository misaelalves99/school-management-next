// src/mocks/students.test.ts

import mockStudents from './students';
import { Student } from '../types/Student';

describe('mockStudents', () => {
  it('deve ser um array de estudantes', () => {
    expect(Array.isArray(mockStudents)).toBe(true);
    expect(mockStudents.length).toBeGreaterThan(0);
  });

  it('cada estudante deve ter as propriedades esperadas', () => {
    mockStudents.forEach((student: Student) => {
      expect(student).toHaveProperty('id');
      expect(student).toHaveProperty('name');
      expect(student).toHaveProperty('enrollmentNumber');
      expect(student).toHaveProperty('phone');
      expect(student).toHaveProperty('address');
      expect(student).toHaveProperty('email');
      expect(student).toHaveProperty('dateOfBirth');
    });
  });

  it('deve conter o estudante João Silva com matrícula 20230001', () => {
    const joao = mockStudents.find(s => s.id === 1);
    expect(joao).toBeDefined();
    expect(joao?.name).toBe('João Silva');
    expect(joao?.enrollmentNumber).toBe('20230001');
  });

  it('IDs devem ser únicos', () => {
    const ids = mockStudents.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('emails devem estar no formato válido', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    mockStudents.forEach(student => {
      expect(emailRegex.test(student.email)).toBe(true);
    });
  });
});
