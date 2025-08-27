// src/app/subjects/edit/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './EditPage.module.css';
import { useSubjects } from '../../../hooks/useSubjects';
import type { Subject } from '../../../types/Subject';

export default function EditSubjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const subjectId = Number(params.id);

  const { getSubjectById, updateSubject } = useSubjects();

  const [subject, setSubject] = useState<Subject>({
    id: 0,
    name: '',
    description: '',
    workloadHours: 0,
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    const found = getSubjectById(subjectId);
    if (found) setSubject(found);
  }, [subjectId, getSubjectById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    updateSubject(subjectId, {
      name: subject.name,
      description: subject.description,
      workloadHours: subject.workloadHours,
    });

    router.push('/subjects');
  };

  if (!subject.id) {
    return (
      <div className={styles.pageContainer}>
        <h2>Disciplina não encontrada.</h2>
        <button className={styles.btnSecondary} onClick={() => router.push('/subjects')}>
          Voltar à Lista
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Editar Disciplina</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="id" value={subject.id} />

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">Nome da Disciplina</label>
          <input
            id="name"
            name="name"
            type="text"
            value={subject.name}
            onChange={handleChange}
            className={styles.inputField}
          />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={subject.description}
            onChange={handleChange}
            className={styles.textareaField}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="workloadHours">Carga Horária</label>
          <input
            id="workloadHours"
            name="workloadHours"
            type="number"
            value={subject.workloadHours}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>

        <button type="submit" className={styles.btnPrimary}>
          Salvar Alterações
        </button>
      </form>

      <button className={styles.btnSecondary} onClick={() => router.push('/subjects')}>
        Voltar à Lista
      </button>
    </div>
  );
}
