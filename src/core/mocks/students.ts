// src/core/mocks/students.ts
import type { Student } from '@/types/Student.js';

export const studentsMock: Student[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@aluno.com',
    dateOfBirth: '2008-05-15',
    enrollmentNumber: '2024-0001',
    phone: '(31) 90000-1111',
    address: 'Rua A, 100',
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    email: 'maria.oliveira@aluno.com',
    dateOfBirth: '2007-09-20',
    enrollmentNumber: '2024-0002',
    phone: '(31) 90000-2222',
    address: 'Rua B, 200',
  },
  {
    id: 3,
    name: 'Pedro Santos',
    email: 'pedro.santos@aluno.com',
    dateOfBirth: '2009-01-10',
    enrollmentNumber: '2024-0003',
    phone: '(31) 90000-3333',
    address: 'Rua C, 300',
  },
];
