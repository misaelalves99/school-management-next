// src/app/students/edit/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './EditPage.module.css';
import { useStudents } from '../../../hooks/useStudents';
import type { Student } from '../../../types/Student';

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getStudentById, updateStudent } = useStudents();

  const numericId = Number(id); // ✅ converte string -> number

  const [formData, setFormData] = useState<Student>({
    id: numericId,
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!id || isNaN(numericId)) {
      router.push('/students');
      return;
    }

    const student = getStudentById(numericId);
    if (!student) {
      alert('Aluno não encontrado.');
      router.push('/students');
      return;
    }

    setFormData(student);
  }, [numericId, id, router, getStudentById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(numericId, formData); // ✅ usa número
    router.push('/students');
  };

  return (
    <>
      <h1 className={styles.title}>Editar Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(formData).map(([key, val]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type={key === 'dateOfBirth' ? 'date' : 'text'}
              value={val as string}
              onChange={handleChange}
              className={styles.inputField}
              onFocus={(e) => e.currentTarget.classList.add(styles.inputFieldFocus)}
              onBlur={(e) => e.currentTarget.classList.remove(styles.inputFieldFocus)}
            />
          </div>
        ))}
        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button type="button" className={styles.btnSecondary} onClick={() => router.push('/students')}>Voltar</button>
        </div>
      </form>
    </>
  );
}
