// src/app/teachers/create/page.tsx

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';
import { useTeachers } from '../../hooks/useTeachers';
import type { TeacherFormData } from '../../types/Teacher';

export default function TeacherCreate() {
  const router = useRouter();
  const { createTeacher } = useTeachers();

  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    dateOfBirth: '',
    subject: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});

  /** Validação do formulário */
  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido.';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!formData.subject.trim()) newErrors.subject = 'Disciplina é obrigatória.';
    if (formData.phone && !/^\+?[0-9\s-]{8,15}$/.test(formData.phone)) newErrors.phone = 'Telefone inválido.';
    if (formData.address && formData.address.length < 5) newErrors.address = 'Endereço muito curto.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /** Atualiza os inputs dinamicamente */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  /** Submete formulário */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      createTeacher(formData);
      alert('Professor salvo com sucesso!');
      router.push('/teachers');
    },
    [formData, validate, router, createTeacher]
  );

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Cadastrar Novo Professor</h1>

      <form onSubmit={handleSubmit} className={styles.createForm}>
        {[
          { label: 'Nome', name: 'name', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Data de Nascimento', name: 'dateOfBirth', type: 'date' },
          { label: 'Disciplina', name: 'subject', type: 'text' },
          { label: 'Telefone', name: 'phone', type: 'tel' },
          { label: 'Endereço', name: 'address', type: 'text' },
        ].map(({ label, name, type }) => (
          <div key={name} className={styles.formGroup}>
            <label htmlFor={name} className={styles.formLabel}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name as keyof TeacherFormData]}
              onChange={handleChange}
              className={styles.formInput}
            />
            {errors[name as keyof TeacherFormData] && (
              <span className={styles.formError}>
                {errors[name as keyof TeacherFormData]}
              </span>
            )}
          </div>
        ))}

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push('/teachers')}
          >
            Voltar à Lista
          </button>
        </div>
      </form>
    </div>
  );
}
