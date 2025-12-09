// src/core/mocks/enrollments.ts
import type { Enrollment } from '@/types/Enrollment.js';

export const enrollmentsMock: Enrollment[] = [
  {
    id: 1,
    studentId: 1,
    classRoomId: 1,
    enrollmentDate: '2024-02-01',
    status: 'ACTIVE',
  },
  {
    id: 2,
    studentId: 2,
    classRoomId: 1,
    enrollmentDate: '2024-02-05',
    status: 'ACTIVE',
  },
  {
    id: 3,
    studentId: 3,
    classRoomId: 2,
    enrollmentDate: '2024-02-10',
    status: 'ACTIVE',
  },
];
