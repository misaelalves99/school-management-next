// src/app/enrollments/create/page.tsx

'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';

import type { Student } from '../../types/Student';
import type { ClassRoom } from '../../types/Classroom';
import type { EnrollmentForm } from '../../types/Enrollment';

interface CreateEnrollmentProps {
  students?: Student[];       // agora opcional
  classRooms?: ClassRoom[];   // agora opcional
  onCreate: (data: EnrollmentForm) => Promise<void>;
}

export default function CreateEnrollment({
  students = [],
  classRooms = [],
  onCreate,
}: CreateEnrollmentProps) {
  const router = useRouter();

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onCreate(form);
      router.push('/enrollments');
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'studentId' || name === 'classRoomId' ? (value ? Number(value) : '') : value,
    }));
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
            {students.map(s => (
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
            {classRooms.map(c => (
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
