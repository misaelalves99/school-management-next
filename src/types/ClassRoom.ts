// src/types/ClassRoom.ts
import type { Subject } from './Subject';
import type { Teacher } from './Teacher';

export interface ClassRoom {
  id: number;
  name: string;
  capacity: number;
  schedule: string;

  // Campos adicionais usados na UI do dashboard
  code?: string;        // ex.: código interno da turma
  grade?: string;       // ex.: "1º Ano A", "8º Ano B"
  period?: string;      // ex.: "Manhã", "Tarde", "Noite"
  createdAt?: string;   // para exibição em tabelas (opcional)
  updatedAt?: string;   // última atualização (opcional)

  subjects: Subject[];
  teachers: Teacher[];
  classTeacher: Teacher | null;
}
