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

// Tipo usado na listagem com os nomes já resolvidos
export interface EnrollmentWithNames extends Enrollment {
  studentName: string;
  classRoomName: string;
}
