// src/mocks/enrollments.ts

export type Enrollment = {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string;
  status: string;
};

// Para listagem com nomes resolvidos
export type EnrollmentWithNames = Enrollment & {
  studentName: string;
  classRoomName: string;
};

// Array de mocks "puros"
const mockEnrollments: Enrollment[] = [
  { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-10', status: 'Ativo' },
  { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-01-15', status: 'Inativo' },
  { id: 3, studentId: 1, classRoomId: 2, enrollmentDate: '2025-02-01', status: 'Ativo' },
];

// Array de mocks "com nomes" (para testes de UI)
const mockEnrollmentsWithNames: EnrollmentWithNames[] = [
  { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-10', status: 'Ativo', studentName: 'Aluno 1', classRoomName: 'Sala 1' },
  { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-01-15', status: 'Inativo', studentName: 'Aluno 2', classRoomName: 'Sala 2' },
  { id: 3, studentId: 1, classRoomId: 2, enrollmentDate: '2025-02-01', status: 'Ativo', studentName: 'Aluno 1', classRoomName: 'Sala 2' },
];

export default mockEnrollments;
export { mockEnrollmentsWithNames };
