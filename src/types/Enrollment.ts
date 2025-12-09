// src/types/Enrollment.ts

export type EnrollmentStatus = 'ACTIVE' | 'PENDING' | 'CANCELLED';

export interface Enrollment {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string; // ISO string
  status: EnrollmentStatus;

  // 🔹 Campos de auditoria (opcionais para não quebrar mocks antigos)
  createdAt?: string;   // ISO
  updatedAt?: string;   // ISO
}

// Payload usado para criar/editar matrícula no contexto
export interface EnrollmentForm {
  studentId: number | '';
  classRoomId: number | '';
  enrollmentDate: string;
  status: EnrollmentStatus;
}

export interface EnrollmentWithNames extends Enrollment {
  studentName: string;
  classRoomName: string;
}
