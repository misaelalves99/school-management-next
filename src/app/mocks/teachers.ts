// src/mocks/teachers.ts

export interface Teacher {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string; // ISO string
  subject: string;
  phone: string;
  address: string;
  photoUrl?: string;
}

// Inicial mock teachers
let teachersData: Teacher[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    dateOfBirth: "1980-05-12",
    subject: "Matemática",
    phone: "123456789",
    address: "Rua A, 123",
    photoUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Maria Souza",
    email: "maria.souza@email.com",
    dateOfBirth: "1975-10-30",
    subject: "História",
    phone: "987654321",
    address: "Av. B, 456",
    photoUrl: "https://i.pravatar.cc/150?img=2",
  },
];

// Funções para manipular professores (simula API)
export function getTeachers() {
  return [...teachersData];
}

export function getTeacherById(id: number) {
  return teachersData.find(t => t.id === id);
}

export function createTeacher(teacher: Omit<Teacher, "id">): Teacher {
  const newTeacher = { ...teacher, id: Math.max(0, ...teachersData.map(t => t.id)) + 1 };
  teachersData.push(newTeacher);
  return newTeacher;
}

export function updateTeacher(id: number, updated: Partial<Teacher>): Teacher | null {
  const index = teachersData.findIndex(t => t.id === id);
  if (index === -1) return null;
  teachersData[index] = { ...teachersData[index], ...updated };
  return teachersData[index];
}

export function deleteTeacher(id: number) {
  teachersData = teachersData.filter(t => t.id !== id);
}
