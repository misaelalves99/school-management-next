// src/app/enrollments/edit/[id]/page.tsx

'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './EditPage.module.css';

import type { Enrollment } from '../../../types/Enrollment';
import { mockEnrollments } from '../../../mocks/enrollments';

export default function EditEnrollmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [formData, setFormData] = useState<Enrollment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    const enrollmentId = Number(id);

    const enrollment = mockEnrollments.find(e => e.id === enrollmentId);
    if (!enrollment) {
      alert('Matrícula não encontrada');
      router.push('/enrollments');
      return;
    }

    setFormData({ ...enrollment });
  }, [id, router]);

  if (!formData) return <div>Carregando matrícula...</div>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      // simulação de update (como não tem API ainda)
      const index = mockEnrollments.findIndex(e => e.id === formData.id);
      if (index !== -1) {
        mockEnrollments[index] = { ...formData };
      }

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
          <input
            id="studentId"
            name="studentId"
            type="number"
            value={formData.studentId}
            onChange={handleChange}
            className={styles.inputField}
          />
          {errors.studentId && <span className={styles.textDanger}>{errors.studentId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="classRoomId">Turma</label>
          <input
            id="classRoomId"
            name="classRoomId"
            type="number"
            value={formData.classRoomId}
            onChange={handleChange}
            className={styles.inputField}
          />
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

        <button type="submit" className={styles.btnSubmit}>
          Salvar Alterações
        </button>
      </form>

      <button className={styles.btnSecondary} onClick={() => router.push('/enrollments')}>
        Voltar à Lista
      </button>
    </>
  );
}
