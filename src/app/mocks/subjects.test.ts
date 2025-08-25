// src/mocks/subjects.test.ts

import { mockSubjects } from './subjects';
import { Subject } from '../types/Subject';

describe('mockSubjects', () => {
  it('deve ser um array de disciplinas', () => {
    expect(Array.isArray(mockSubjects)).toBe(true);
    expect(mockSubjects.length).toBeGreaterThan(0);
  });

  it('cada disciplina deve ter as propriedades esperadas', () => {
    mockSubjects.forEach((subject: Subject) => {
      expect(subject).toHaveProperty('id');
      expect(subject).toHaveProperty('name');
      expect(subject).toHaveProperty('description');
      expect(subject).toHaveProperty('workloadHours');
    });
  });

  it('IDs devem ser únicos', () => {
    const ids = mockSubjects.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('todas as cargas horárias devem ser números positivos', () => {
    mockSubjects.forEach(s => {
      expect(typeof s.workloadHours).toBe('number');
      expect(s.workloadHours).toBeGreaterThan(0);
    });
  });

  it('deve conter Matemática como disciplina', () => {
    const math = mockSubjects.find(s => s.name === 'Matemática');
    expect(math).toBeDefined();
    expect(math?.description).toBe('Disciplina de matemática básica');
  });
});
