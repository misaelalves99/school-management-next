// /src/mocks/classRooms.ts
import type { ClassRoom } from '../types/Classroom';
import type { Teacher } from '../types/Teacher';

// Mock completo de professores
const mockTeachers: Teacher[] = [
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '123456789',
    subject: 'Matemática',
    dateOfBirth: '1980-05-10',
    address: 'Rua A, 100',
  },
  {
    id: 2,
    name: 'João Souza',
    email: 'joao.souza@email.com',
    phone: '987654321',
    subject: 'Português',
    dateOfBirth: '1975-09-22',
    address: 'Rua B, 200',
  },
  {
    id: 3,
    name: 'Carlos Pereira',
    email: 'carlos.pereira@email.com',
    phone: '555444333',
    subject: 'História',
    dateOfBirth: '1978-11-15',
    address: 'Rua C, 300',
  },
];

const mockClassRooms: ClassRoom[] = [
  {
    id: 1,
    name: 'Sala A',
    capacity: 30,
    schedule: 'Seg - 08:00 às 10:00',
    subjects: [
      { id: 1, name: 'Matemática', description: 'Matemática básica', workloadHours: 60 },
      { id: 2, name: 'Português', description: 'Gramática e Literatura', workloadHours: 60 },
    ],
    teachers: [mockTeachers[0], mockTeachers[1]],
    classTeacher: mockTeachers[0],
  },
  {
    id: 2,
    name: 'Sala B',
    capacity: 25,
    schedule: 'Ter - 10:00 às 12:00',
    subjects: [
      { id: 3, name: 'História', description: 'História geral', workloadHours: 60 },
    ],
    teachers: [mockTeachers[2]],
    classTeacher: mockTeachers[2],
  },
  {
    id: 3,
    name: 'Sala C',
    capacity: 20,
    schedule: 'Qua - 13:00 às 15:00',
    subjects: [],
    teachers: [],
    classTeacher: null,
  },
];

export default mockClassRooms;
