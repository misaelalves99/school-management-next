// src/app/teachers/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';
import { createTeacher } from '../../mocks/teachers';
import type { TeacherFormData } from '../../types/Teacher';

export default function TeacherCreate() {
  const router = useRouter();

  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    dateOfBirth: '',
    subject: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido.';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!formData.subject.trim()) newErrors.subject = 'Disciplina é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    createTeacher(formData);
    alert('Professor salvo com sucesso!');
    router.push('/teachers');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.title}>Cadastrar Novo Professor</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <span className={styles.textDanger}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dateOfBirth" className={styles.label}>Data de Nascimento</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.dateOfBirth && <span className={styles.textDanger}>{errors.dateOfBirth}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>Disciplina</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.subject && <span className={styles.textDanger}>{errors.subject}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Telefone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>Endereço</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Salvar</button>
      </form>

      <button
        type="button"
        className={styles.btnSecondary}
        onClick={() => router.push('/teachers')}
      >
        Voltar à Lista
      </button>
    </div>
  );
}
