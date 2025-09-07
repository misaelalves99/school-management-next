// src/mocks/classRooms.ts

import type { ClassRoom } from '../types/Classroom';
import type { Subject } from '../types/Subject';
import type { Teacher } from '../types/Teacher';

// Mock inicial com tipagem completa
const initialClassRooms: ClassRoom[] = [
  {
    id: 1,
    name: 'Sala A',
    capacity: 30,
    schedule: 'Seg - 08:00 às 10:00',
    subjects: [
      { id: 1, name: 'Matemática', description: 'Matemática básica', workloadHours: 40 } as Subject,
      { id: 2, name: 'Português', description: 'Português avançado', workloadHours: 35 } as Subject
    ],
    teachers: [
      {
        id: 1,
        name: 'Maria Silva',
        email: 'maria@email.com',
        dateOfBirth: '1980-01-01',
        subject: 'Matemática',
        phone: '123456789',
        address: 'Rua A'
      } as Teacher,
      {
        id: 2,
        name: 'João Souza',
        email: 'joao@email.com',
        dateOfBirth: '1975-05-20',
        subject: 'Português',
        phone: '987654321',
        address: 'Rua B'
      } as Teacher
    ],
    classTeacher: {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      dateOfBirth: '1980-01-01',
      subject: 'Matemática',
      phone: '123456789',
      address: 'Rua A'
    } as Teacher
  },
  {
    id: 2,
    name: 'Sala B',
    capacity: 25,
    schedule: 'Ter - 10:00 às 12:00',
    subjects: [
      { id: 3, name: 'História', description: 'História do Brasil', workloadHours: 30 } as Subject
    ],
    teachers: [
      {
        id: 3,
        name: 'Carlos Pereira',
        email: 'carlos@email.com',
        dateOfBirth: '1978-02-10',
        subject: 'História',
        phone: '111222333',
        address: 'Rua C'
      } as Teacher
    ],
    classTeacher: {
      id: 3,
      name: 'Carlos Pereira',
      email: 'carlos@email.com',
      dateOfBirth: '1978-02-10',
      subject: 'História',
      phone: '111222333',
      address: 'Rua C'
    } as Teacher
  }
];

export const mockClassRooms: ClassRoom[] = [...initialClassRooms];
