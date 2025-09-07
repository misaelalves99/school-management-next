// src/app/students/create/page.tsx

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';
import { useStudents } from '../../hooks/useStudents';
import type { Student } from '../../types/Student';

export default function CreateStudentPage() {
  const router = useRouter();
  const { addStudent } = useStudents();

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof Student, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido.';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!formData.enrollmentNumber.trim()) newErrors.enrollmentNumber = 'Matrícula é obrigatória.';
    if (formData.phone && !/^\+?[0-9\s-]{8,15}$/.test(formData.phone)) newErrors.phone = 'Telefone inválido.';
    if (formData.address && formData.address.length < 3) newErrors.address = 'Endereço muito curto.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      addStudent(formData);
      alert('Aluno cadastrado com sucesso!');
      router.push('/students');
    },
    [formData, validate, addStudent, router]
  );

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Cadastrar Novo Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        {[
          { label: 'Nome', name: 'name', type: 'text', placeholder: 'Digite o nome do aluno' },
          { label: 'Email', name: 'email', type: 'email', placeholder: 'Digite o email' },
          { label: 'Data de Nascimento', name: 'dateOfBirth', type: 'date', placeholder: '' },
          { label: 'Matrícula', name: 'enrollmentNumber', type: 'text', placeholder: 'Número de matrícula' },
          { label: 'Telefone', name: 'phone', type: 'tel', placeholder: 'Digite o telefone' },
          { label: 'Endereço', name: 'address', type: 'text', placeholder: 'Digite o endereço' },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name} className={styles.formGroup}>
            <label htmlFor={name} className={styles.formLabel}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              className={styles.formInput}
            />
            {errors[name as keyof typeof formData] && (
              <span className={styles.formError}>{errors[name as keyof typeof formData]}</span>
            )}
          </div>
        ))}

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push('/students')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
