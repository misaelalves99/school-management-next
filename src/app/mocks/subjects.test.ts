// src/mocks/subjects.test.ts

import { mockSubjects } from './subjects';
import { Subject } from '../types/Subject';

describe('mockSubjects', () => {
  it('deve ser um array de disciplinas', () => {
    expect(Array.isArray(mockSubjects)).toBe(true);
    expect(mockSubjects.length).toBeGreaterThan(0);
  });

  it('cada disciplina deve ter as propriedades esperadas e tipos corretos', () => {
    mockSubjects.forEach((subject: Subject) => {
      expect(typeof subject.id).toBe('number');
      expect(typeof subject.name).toBe('string');
      expect(typeof subject.description).toBe('string');
      expect(typeof subject.workloadHours).toBe('number');
      expect(subject.workloadHours).toBeGreaterThan(0);
    });
  });

  it('IDs devem ser únicos', () => {
    const ids = mockSubjects.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('deve conter Matemática como disciplina', () => {
    const math = mockSubjects.find(s => s.name === 'Matemática');
    expect(math).toBeDefined();
    expect(math?.description).toBe('Disciplina de matemática básica');
  });

  it('permite adicionar nova disciplina mantendo integridade', () => {
    const initialLength = mockSubjects.length;
    const newSubject: Subject = {
      id: 999,
      name: 'História',
      description: 'História do Brasil',
      workloadHours: 40
    };
    mockSubjects.push(newSubject);
    expect(mockSubjects.length).toBe(initialLength + 1);
    expect(mockSubjects[mockSubjects.length - 1]).toEqual(newSubject);
  });
});
