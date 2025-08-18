// src/types/Enrollment.ts

export interface Enrollment {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string; // ISO string
  status: string;
}

// Tipo usado apenas no formulário de criação/edição
export interface EnrollmentForm {
  studentId: number | '';
  classRoomId: number | '';
  enrollmentDate: string;
}
