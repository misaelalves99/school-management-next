// src/app/enrollments/edit/[id]/page.tsx

'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './EditPage.module.css';

import type { Enrollment } from '../../../types/Enrollment';
import { useEnrollments } from '../../../hooks/useEnrollments';
import { useStudents } from '../../../hooks/useStudents';
import { useClassRooms } from '../../../hooks/useClassRooms';

export default function EditEnrollmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { enrollments, updateEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [formData, setFormData] = useState<Enrollment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    const enrollmentId = Number(id);

    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) {
      alert('Matrícula não encontrada');
      router.push('/enrollments');
      return;
    }

    setFormData({ ...enrollment });
  }, [id, enrollments, router]);

  if (!formData) return <div>Carregando matrícula...</div>;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'studentId' || name === 'classRoomId' ? Number(value) : value,
      } as Enrollment;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const newErrors: Record<string, string> = {};
    if (!formData.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!formData.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!formData.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      updateEnrollment(formData); // Atualiza pelo contexto
      router.push('/enrollments');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className={styles.title}>Editar Matrícula</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="id" value={formData.id} />

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="studentId">Aluno</label>
          <select
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="">Selecione o Aluno</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.studentId && <span className={styles.textDanger}>{errors.studentId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="classRoomId">Turma</label>
          <select
            id="classRoomId"
            name="classRoomId"
            value={formData.classRoomId}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="">Selecione a Turma</option>
            {classRooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.classRoomId && <span className={styles.textDanger}>{errors.classRoomId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="enrollmentDate">Data da Matrícula</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={formData.enrollmentDate}
            onChange={handleChange}
            className={styles.inputField}
          />
          {errors.enrollmentDate && <span className={styles.textDanger}>{errors.enrollmentDate}</span>}
        </div>

        <button type="submit" className={styles.btnSubmit}>Salvar Alterações</button>
      </form>

      <button className={styles.btnSecondary} onClick={() => router.push('/enrollments')}>
        Voltar à Lista
      </button>
    </>
  );
}
