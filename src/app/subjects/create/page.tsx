// src/app/subjects/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';
import type { Subject } from '../../types/Subject';
import { useSubjects } from '../../hooks/useSubjects';

export default function CreateSubjectPage() {
  const router = useRouter();
  const { createSubject } = useSubjects();

  const [subject, setSubject] = useState<Omit<Subject, 'id'>>({
    name: '',
    description: '',
    workloadHours: 0,
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSubject(prev => ({
      ...prev,
      [name]: name === 'workloadHours' ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!subject.name.trim()) newErrors.name = 'O nome da disciplina é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createSubject(subject);
    alert('Disciplina cadastrada com sucesso!');
    router.push('/subjects');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Cadastrar Nova Disciplina</h1>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Nome da Disciplina</label>
          <input
            type="text"
            id="name"
            name="name"
            value={subject.name}
            onChange={handleChange}
            className={styles.formInput}
          />
          {errors.name && <span className={styles.formError}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.formLabel}>Descrição</label>
          <textarea
            id="description"
            name="description"
            value={subject.description}
            onChange={handleChange}
            className={styles.formInput}
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workloadHours" className={styles.formLabel}>Carga Horária</label>
          <input
            type="number"
            id="workloadHours"
            name="workloadHours"
            value={subject.workloadHours}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push('/subjects')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
