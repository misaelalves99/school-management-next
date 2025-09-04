// src/app/mocks/classRooms.test.ts

import { mockClassRooms } from './classRooms';
import type { ClassRoom } from '../types/Classroom';
import type { Teacher } from '../types/Teacher';
import type { Subject } from '../types/Subject';

describe('mockClassRooms', () => {
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
        expect(subject).toHaveProperty('id');
        expect(subject).toHaveProperty('name');
        expect(subject).toHaveProperty('description');
        expect(subject).toHaveProperty('workloadHours');
      });
    });
  });

  it('cada teacher deve ter formato correto', () => {
    mockClassRooms.forEach((room: ClassRoom) => {
      room.teachers.forEach((teacher: Teacher) => {
        expect(teacher).toHaveProperty('id');
        expect(teacher).toHaveProperty('name');
        expect(teacher).toHaveProperty('email');
        expect(teacher).toHaveProperty('phone');
        expect(teacher).toHaveProperty('subject');
        expect(teacher).toHaveProperty('dateOfBirth');
        expect(teacher).toHaveProperty('address');
      });
    });
  });

  it('classTeacher deve ser null ou um Teacher válido', () => {
    mockClassRooms.forEach((room: ClassRoom) => {
      const ct = room.classTeacher;
      if (ct !== null) {
        expect(ct).toHaveProperty('id');
        expect(ct).toHaveProperty('name');
        expect(ct).toHaveProperty('email');
        expect(ct).toHaveProperty('phone');
        expect(ct).toHaveProperty('subject');
        expect(ct).toHaveProperty('dateOfBirth');
        expect(ct).toHaveProperty('address');
      }
    });
  });
});
