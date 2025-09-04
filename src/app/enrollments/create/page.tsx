// src/app/enrollments/create/page.tsx

'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';

import type { Student } from '../../types/Student';
import type { ClassRoom } from '../../types/Classroom';
import type { EnrollmentForm } from '../../types/Enrollment';

import studentsMock from '../../mocks/students';
import { mockClassRooms as classRoomsMock } from '../../mocks/classRooms';

import { useEnrollments } from '../../hooks/useEnrollments';

export default function CreateEnrollmentPage() {
  const router = useRouter();
  const { addEnrollment, enrollments } = useEnrollments();

  const [form, setForm] = useState<EnrollmentForm>({
    studentId: '',
    classRoomId: '',
    enrollmentDate: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!form.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!form.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'studentId' || name === 'classRoomId' ? (value ? Number(value) : '') : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newEnrollmentId =
      enrollments.length > 0 ? Math.max(...enrollments.map(e => e.id)) + 1 : 1;

    // Encontra os nomes pelos IDs selecionados
    const student = studentsMock.find(s => s.id === Number(form.studentId));
    const classRoom = classRoomsMock.find(c => c.id === Number(form.classRoomId));

    if (!student || !classRoom) return;

    addEnrollment({
      id: newEnrollmentId,
      studentId: Number(form.studentId),
      classRoomId: Number(form.classRoomId),
      studentName: student.name,
      classRoomName: classRoom.name,
      enrollmentDate: form.enrollmentDate,
      status: 'Ativo',
    });

    router.push('/enrollments');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Nova Matrícula</h1>

      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formGroup}>
          <label htmlFor="studentId" className={styles.formLabel}>Aluno</label>
          <select
            id="studentId"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="">Selecione o Aluno</option>
            {studentsMock.map((s: Student) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.studentId && <span className={styles.formError}>{errors.studentId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="classRoomId" className={styles.formLabel}>Turma</label>
          <select
            id="classRoomId"
            name="classRoomId"
            value={form.classRoomId}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="">Selecione a Turma</option>
            {classRoomsMock.map((c: ClassRoom) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.classRoomId && <span className={styles.formError}>{errors.classRoomId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="enrollmentDate" className={styles.formLabel}>Data da Matrícula</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={form.enrollmentDate}
            onChange={handleChange}
            className={styles.formInput}
          />
          {errors.enrollmentDate && <span className={styles.formError}>{errors.enrollmentDate}</span>}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push('/enrollments')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
