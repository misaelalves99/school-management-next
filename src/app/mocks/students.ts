// src/mocks/students.ts

import { Student } from '../types/Student';

export const mockStudents: Student[] = [
  {
    id: 1,
    name: 'João Silva',
    enrollmentNumber: '20230001',
    phone: '123456789',
    address: 'Rua A',
    email: 'joao.silva@email.com',
    dateOfBirth: '2000-01-15'
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    enrollmentNumber: '20230002',
    phone: '987654321',
    address: 'Rua B',
    email: 'maria.oliveira@email.com',
    dateOfBirth: '2001-03-22'
  },
  {
    id: 3,
    name: 'Pedro Santos',
    enrollmentNumber: '20230003',
    phone: '111222333',
    address: 'Rua C',
    email: 'pedro.santos@email.com',
    dateOfBirth: '1999-07-09'
  },
  {
    id: 4,
    name: 'Ana Costa',
    enrollmentNumber: '20230004',
    phone: '444555666',
    address: 'Rua D',
    email: 'ana.costa@email.com',
    dateOfBirth: '2002-11-05'
  },
  {
    id: 5,
    name: 'Carlos Souza',
    enrollmentNumber: '20230005',
    phone: '777888999',
    address: 'Rua E',
    email: 'carlos.souza@email.com',
    dateOfBirth: '2000-09-12'
  }
];

export default mockStudents;
