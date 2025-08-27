// src/app/subjects/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';
import { useSubjects } from '../../hooks/useSubjects';
import type { Subject } from '../../types/Subject';

export default function CreateSubjectPage() {
  const router = useRouter();
  const { createSubject } = useSubjects();

  const [subject, setSubject] = useState<Omit<Subject, 'id'>>({ name: '', description: '' });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject(prev => ({ ...prev, [name]: value }));
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
    router.push('/subjects');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.title}>Cadastrar Nova Disciplina</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Nome da Disciplina</label>
          <input
            type="text"
            id="name"
            name="name"
            value={subject.name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Descrição</label>
          <textarea
            id="description"
            name="description"
            value={subject.description}
            onChange={handleChange}
            className={styles.textarea}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Salvar</button>
      </form>

      <button
        type="button"
        className={styles.btnSecondary}
        onClick={() => router.push('/subjects')}
      >
        Voltar à Lista
      </button>
    </div>
  );
}
