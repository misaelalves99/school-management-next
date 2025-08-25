// src/mocks/classRooms.test.ts

import mockClassRooms from './classRooms';
import type { Teacher } from '../types/Teacher';

describe('mockClassRooms', () => {
  it('deve ser um array de ClassRoom', () => {
    expect(Array.isArray(mockClassRooms)).toBe(true);
    mockClassRooms.forEach((room) => {
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
    mockClassRooms.forEach((room) => {
      expect(typeof room.capacity).toBe('number');
      expect(room.capacity).toBeGreaterThan(0);
    });
  });

  it('cada subject deve ter id, name, description e workloadHours', () => {
    mockClassRooms.forEach((room) => {
      room.subjects.forEach((subject) => {
        expect(subject).toHaveProperty('id');
        expect(subject).toHaveProperty('name');
        expect(subject).toHaveProperty('description');
        expect(subject).toHaveProperty('workloadHours');
      });
    });
  });

  it('cada teacher deve ter formato correto', () => {
    mockClassRooms.forEach((room) => {
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
    mockClassRooms.forEach((room) => {
      const ct = room.classTeacher;
      if (ct !== null) {
        expect(ct).toHaveProperty('id');
        expect(ct).toHaveProperty('name');
      }
    });
  });
});
