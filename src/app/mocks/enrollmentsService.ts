// src/mocks/enrollmentsService.ts

import enrollments, { Enrollment } from './enrollments';

export function getEnrollmentById(id: number): Enrollment | undefined {
  return enrollments.find(e => e.id === id);
}

export function deleteEnrollment(id: number): boolean {
  const index = enrollments.findIndex(e => e.id === id);
  if (index !== -1) {
    enrollments.splice(index, 1);
    return true;
  }
  return false;
}

export function updateEnrollment(updated: Enrollment): boolean {
  const index = enrollments.findIndex(e => e.id === updated.id);
  if (index !== -1) {
    enrollments[index] = updated;
    return true;
  }
  return false;
}

export function addEnrollment(newEnrollment: Enrollment) {
  enrollments.push(newEnrollment);
}
