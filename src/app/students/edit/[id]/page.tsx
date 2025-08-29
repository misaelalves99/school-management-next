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

  const numericId = Number(id);

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
    updateStudent(numericId, formData);
    router.push('/students');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Editar Aluno</h1>

      <form onSubmit={handleSubmit} className={styles.createForm}>
        {Object.entries(formData).map(([key, val]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key} className={styles.formLabel}>
              {key === 'dateOfBirth' ? 'Data de Nascimento' : key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              id={key}
              name={key}
              type={key === 'dateOfBirth' ? 'date' : 'text'}
              value={val as string}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
        ))}

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>
            Salvar Alterações
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push('/students')}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
