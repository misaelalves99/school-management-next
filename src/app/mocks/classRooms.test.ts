// src/mocks/classRooms.test.ts

import { mockClassRooms } from './classRooms';
import type { ClassRoom } from '../types/Classroom';
import type { Teacher } from '../types/Teacher';
import type { Subject } from '../types/Subject';

describe('mockClassRooms (tipado)', () => {
  it('deve ser um array de ClassRoom', () => {
    expect(Array.isArray(mockClassRooms)).toBe(true);
    mockClassRooms.forEach((room: ClassRoom) => {
      expect(room).toHaveProperty('id');
      expect(room).toHaveProperty('name');
      expect(room).toHaveProperty('capacity');
      expect(room).toHaveProperty('schedule');
      expect(room).toHaveProperty('subjects');
      expect(room).toHaveProperty('teachers');
      expect(room).toHaveProperty('classTeacher');
    });
  });

  it('cada sala deve ter capacidade positiva', () => {
    mockClassRooms.forEach((room: ClassRoom) => {
      expect(typeof room.capacity).toBe('number');
      expect(room.capacity).toBeGreaterThan(0);
    });
  });

  it('cada subject deve ter id, name, description e workloadHours', () => {
    mockClassRooms.forEach((room: ClassRoom) => {
      room.subjects.forEach((subject: Subject) => {
        expect(subject.id).toBeDefined();
        expect(subject.name).toBeDefined();
        expect(subject.description).toBeDefined();
        expect(subject.workloadHours).toBeGreaterThan(0);
      });
    });
  });

  it('cada teacher deve ter todos os campos obrigatórios', () => {
    mockClassRooms.forEach((room: ClassRoom) => {
      room.teachers.forEach((teacher: Teacher) => {
        expect(teacher.id).toBeDefined();
        expect(teacher.name).toBeDefined();
        expect(teacher.email).toBeDefined();
        expect(teacher.phone).toBeDefined();
        expect(teacher.subject).toBeDefined();
        expect(teacher.dateOfBirth).toBeDefined();
        expect(teacher.address).toBeDefined();
      });
    });
  });

  it('classTeacher deve ser null ou um Teacher válido', () => {
    mockClassRooms.forEach((room: ClassRoom) => {
      const ct = room.classTeacher;
      if (ct !== null) {
        expect(ct.id).toBeDefined();
        expect(ct.name).toBeDefined();
        expect(ct.email).toBeDefined();
        expect(ct.phone).toBeDefined();
        expect(ct.subject).toBeDefined();
        expect(ct.dateOfBirth).toBeDefined();
        expect(ct.address).toBeDefined();
      }
    });
  });
});
