// src/types/Teacher.ts

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
  subject: string;
  dateOfBirth: string;
  address: string;
  photoUrl?: string;
}

// Tipo usado no formulário de cadastro/edição
export interface TeacherFormData {
  name: string;
  email: string;
  dateOfBirth: string;
  subject: string;
  phone: string;
  address: string;
}
