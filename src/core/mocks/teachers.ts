// src/core/mocks/teachers.ts
import type { Teacher } from '@/types/Teacher.js';

export const teachersMock: Teacher[] = [
  {
    id: 1,
    name: 'Ana Souza',
    email: 'ana.souza@escola.com',
    phone: '(31) 99999-1111',
    subject: 'Matemática',
    dateOfBirth: '1985-03-10',
    address: 'Rua das Flores, 123',
  },
  {
    id: 2,
    name: 'Bruno Lima',
    email: 'bruno.lima@escola.com',
    phone: '(31) 98888-2222',
    subject: 'Português',
    dateOfBirth: '1988-07-22',
    address: 'Av. Central, 456',
  },
  {
    id: 3,
    name: 'Carla Mendes',
    email: 'carla.mendes@escola.com',
    phone: '(31) 97777-3333',
    subject: 'História',
    dateOfBirth: '1990-11-05',
    address: 'Rua da Escola, 789',
  },
];
