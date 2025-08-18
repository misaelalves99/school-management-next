// src/app/students/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';
import type { Student } from '../../types/Student';

export default function CreateStudentPage() {
  const router = useRouter();

  const [student, setStudent] = useState<Student>({
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!student.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!student.email.trim()) newErrors.email = 'Email é obrigatório.';
    if (!student.dateOfBirth.trim()) newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!student.enrollmentNumber.trim()) newErrors.enrollmentNumber = 'Matrícula é obrigatória.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('Aluno cadastrado:', student);
    router.push('/students');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.title}>Cadastrar Novo Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Nome</label>
          <input
            id="name"
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <span className={styles.textDanger}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dateOfBirth" className={styles.label}>Data de Nascimento</label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={student.dateOfBirth}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.dateOfBirth && <span className={styles.textDanger}>{errors.dateOfBirth}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="enrollmentNumber" className={styles.label}>Matrícula</label>
          <input
            id="enrollmentNumber"
            type="text"
            name="enrollmentNumber"
            value={student.enrollmentNumber}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.enrollmentNumber && <span className={styles.textDanger}>{errors.enrollmentNumber}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Telefone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={student.phone}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>Endereço</label>
          <input
            id="address"
            type="text"
            name="address"
            value={student.address}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Salvar</button>
      </form>

      <button
        className={styles.btnSecondary}
        onClick={() => router.push('/students')}
      >
        Voltar à Lista
      </button>
    </div>
  );
}
