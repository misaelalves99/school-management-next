// src/core/mocks/classRooms.ts

import type { ClassRoom } from '@/types/ClassRoom';

// ✅ Usando os mesmos aliases que você já usa nos outros mocks/providers
import { subjectsMock } from '@/core/mocks/subjects';
import { teachersMock } from '@/core/mocks/teachers';

export const classRoomsMock: ClassRoom[] = [
  {
    id: 1,
    name: '1º Ano - A',
    capacity: 30,
    schedule: 'Manhã',
    subjects: [subjectsMock[0], subjectsMock[1]],
    teachers: [teachersMock[0], teachersMock[1]],
    classTeacher: teachersMock[0],
  },
  {
    id: 2,
    name: '2º Ano - B',
    capacity: 28,
    schedule: 'Tarde',
    subjects: [subjectsMock[1], subjectsMock[2]],
    teachers: [teachersMock[1], teachersMock[2]],
    classTeacher: teachersMock[1],
  },
];
