// src/mocks/students.ts

import type { Student } from '../types/Student';

// Mock completo de alunos com todas as propriedades do tipo Student
const mockStudents: Student[] = [
  {
    id: 1,
    name: 'João Silva',
    enrollmentNumber: '20230001',
    phone: '123456789',
    address: 'Rua A',
    email: 'joao.silva@email.com',
    dateOfBirth: '2005-01-10',
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    enrollmentNumber: '20230002',
    phone: '987654321',
    address: 'Rua B',
    email: 'maria.oliveira@email.com',
    dateOfBirth: '2004-05-22',
  },
  {
    id: 3,
    name: 'Pedro Santos',
    enrollmentNumber: '20230003',
    phone: '111222333',
    address: 'Rua C',
    email: 'pedro.santos@email.com',
    dateOfBirth: '2006-03-18',
  },
  {
    id: 4,
    name: 'Ana Costa',
    enrollmentNumber: '20230004',
    phone: '444555666',
    address: 'Rua D',
    email: 'ana.costa@email.com',
    dateOfBirth: '2005-07-09',
  },
  {
    id: 5,
    name: 'Carlos Souza',
    enrollmentNumber: '20230005',
    phone: '777888999',
    address: 'Rua E',
    email: 'carlos.souza@email.com',
    dateOfBirth: '2004-12-25',
  },
];

// Exporta como default para facilitar importações
export default mockStudents;
