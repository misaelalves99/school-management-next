// src/app/subjects/edit/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './EditPage.module.css';
import { Subject } from '../../../types/Subject';
import { mockSubjects } from '../../../mocks/subjects';

export default function EditSubjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [subject, setSubject] = useState<Subject>({
    id: 0,
    name: '',
    description: '',
    workloadHours: 0,
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    const found = mockSubjects.find(s => s.id === Number(params.id));
    if (found) setSubject(found);
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject(prev => ({ ...prev, [name]: name === 'workloadHours' ? Number(value) : value }));
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

    console.log('Salvar alterações:', subject);
    router.push('/subjects');
  };

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
