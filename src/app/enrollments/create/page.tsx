// src/app/enrollments/create/page.tsx

'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';

import type { Student } from '../../types/Student';
import type { ClassRoom } from '../../types/Classroom';
import type { EnrollmentForm } from '../../types/Enrollment';

import studentsMock from '../../mocks/students';
import classRoomsMock from '../../mocks/classRooms';

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

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!form.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!form.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'studentId' || name === 'classRoomId' ? (value ? Number(value) : '') : value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Adiciona matrícula via contexto
    const newEnrollmentId = enrollments.length > 0 ? Math.max(...enrollments.map(e => e.id)) + 1 : 1;
    addEnrollment({
      id: newEnrollmentId,
      studentId: Number(form.studentId),
      classRoomId: Number(form.classRoomId),
      enrollmentDate: form.enrollmentDate,
      status: 'Ativo',
    });

    router.push('/enrollments');
  }

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.title}>Nova Matrícula</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="studentId" className={styles.label}>Aluno</label>
          <select
            id="studentId"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            className={styles.formControl}
          >
            <option value="">Selecione o Aluno</option>
            {studentsMock.map((s: Student) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.studentId && <span className={styles.textDanger}>{errors.studentId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="classRoomId" className={styles.label}>Turma</label>
          <select
            id="classRoomId"
            name="classRoomId"
            value={form.classRoomId}
            onChange={handleChange}
            className={styles.formControl}
          >
            <option value="">Selecione a Turma</option>
            {classRoomsMock.map((c: ClassRoom) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.classRoomId && <span className={styles.textDanger}>{errors.classRoomId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="enrollmentDate" className={styles.label}>Data da Matrícula</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={form.enrollmentDate}
            onChange={handleChange}
            className={styles.formControl}
          />
          {errors.enrollmentDate && <span className={styles.textDanger}>{errors.enrollmentDate}</span>}
        </div>

        <button type="submit" className={styles.btnSubmit}>Salvar</button>
      </form>

      <button
        type="button"
        className={styles.btnSecondary}
        onClick={() => router.push('/enrollments')}
      >
        Voltar à Lista
      </button>
    </div>
  );
}
