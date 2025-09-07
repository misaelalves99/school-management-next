// src/mocks/students.test.ts

import mockStudents from './students';
import { Student } from '../types/Student';

describe('mockStudents', () => {
  it('deve ser um array de estudantes', () => {
    expect(Array.isArray(mockStudents)).toBe(true);
    expect(mockStudents.length).toBeGreaterThan(0);
  });

  it('cada estudante deve ter as propriedades esperadas e tipos corretos', () => {
    mockStudents.forEach((student: Student) => {
      expect(typeof student.id).toBe('number');
      expect(typeof student.name).toBe('string');
      expect(typeof student.enrollmentNumber).toBe('string');
      expect(typeof student.phone).toBe('string');
      expect(typeof student.address).toBe('string');
      expect(typeof student.email).toBe('string');
      expect(typeof student.dateOfBirth).toBe('string');

      // Verifica data válida
      const date = new Date(student.dateOfBirth);
      expect(date.toString()).not.toBe('Invalid Date');
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

  it('permite adicionar novo estudante mantendo integridade', () => {
    const initialLength = mockStudents.length;
    const newStudent: Student = {
      id: 999,
      name: 'Teste Student',
      enrollmentNumber: '99999999',
      phone: '000000000',
      address: 'Rua Teste',
      email: 'teste@student.com',
      dateOfBirth: '2005-01-01'
    };
    mockStudents.push(newStudent);
    expect(mockStudents.length).toBe(initialLength + 1);
    expect(mockStudents[mockStudents.length - 1]).toEqual(newStudent);
  });
});
