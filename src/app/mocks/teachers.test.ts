// src/mocks/teachers.test.ts

import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  Teacher,
} from './teachers';

describe('teachers mock API', () => {
  beforeEach(() => {
    // Resetando o estado para os testes
    deleteTeacher(3); // remove caso tenha sido criado antes
    deleteTeacher(4);
  });

  it('getTeachers deve retornar lista inicial', () => {
    const teachers = getTeachers();
    expect(teachers.length).toBeGreaterThanOrEqual(2);
    expect(teachers[0]).toHaveProperty('id');
    expect(teachers[0]).toHaveProperty('name');
  });

  it('getTeacherById deve retornar professor pelo ID', () => {
    const teacher = getTeacherById(1);
    expect(teacher).toBeDefined();
    expect(teacher?.name).toBe('João Silva');
  });

  it('createTeacher deve adicionar um novo professor com ID único', () => {
    const newTeacher: Omit<Teacher, 'id'> = {
      name: 'Carlos Pereira',
      email: 'carlos.pereira@email.com',
      dateOfBirth: '1990-01-01',
      subject: 'Geografia',
      phone: '111222333',
      address: 'Rua C, 789',
      photoUrl: 'https://i.pravatar.cc/150?img=3',
    };

    const created = createTeacher(newTeacher);
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Carlos Pereira');

    const allTeachers = getTeachers();
    expect(allTeachers).toContainEqual(created);
  });

  it('updateTeacher deve atualizar dados de um professor existente', () => {
    const updated = updateTeacher(1, { subject: 'Física' });
    expect(updated).not.toBeNull();
    expect(updated?.subject).toBe('Física');
  });

  it('updateTeacher deve retornar null se professor não existir', () => {
    const result = updateTeacher(999, { subject: 'Química' });
    expect(result).toBeNull();
  });

  it('deleteTeacher deve remover professor pelo ID', () => {
    const allBefore = getTeachers();
    deleteTeacher(2);
    const allAfter = getTeachers();

    expect(allAfter.length).toBe(allBefore.length - 1);
    expect(getTeacherById(2)).toBeUndefined();
  });
});
