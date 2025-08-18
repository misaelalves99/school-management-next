// src/mocks/students.ts

import { Student } from '../types/Student';

export const mockStudents: Student[] = [
  { id: 1, name: 'João Silva', enrollmentNumber: '20230001', phone: '123456789', address: 'Rua A' },
  { id: 2, name: 'Maria Oliveira', enrollmentNumber: '20230002', phone: '987654321', address: 'Rua B' },
  { id: 3, name: 'Pedro Santos', enrollmentNumber: '20230003', phone: '111222333', address: 'Rua C' },
  { id: 4, name: 'Ana Costa', enrollmentNumber: '20230004', phone: '444555666', address: 'Rua D' },
  { id: 5, name: 'Carlos Souza', enrollmentNumber: '20230005', phone: '777888999', address: 'Rua E' },
];

export const students: Student[] = mockStudents;
