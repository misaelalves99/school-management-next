// src/mocks/enrollments.ts

export type Enrollment = {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string;
  status: string;
};

// Array de mocks
export const mockEnrollments: Enrollment[] = [
  {
    id: 1,
    studentId: 1,
    classRoomId: 1,
    enrollmentDate: '2025-01-10',
    status: 'Ativo',
  },
  {
    id: 2,
    studentId: 2,
    classRoomId: 2,
    enrollmentDate: '2025-01-15',
    status: 'Inativo',
  },
  {
    id: 3,
    studentId: 1,
    classRoomId: 2,
    enrollmentDate: '2025-02-01',
    status: 'Ativo',
  },
];

export default mockEnrollments;
