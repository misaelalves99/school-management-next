// src/app/students/edit/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './EditPage.module.css';

const mockStudents = [
  { id: '1', name: 'João Silva', email: 'joao@example.com', dateOfBirth: '2000-01-01', enrollmentNumber: '20230001', phone: '123456789', address: 'Rua A' },
  { id: '2', name: 'Maria Oliveira', email: 'maria@example.com', dateOfBirth: '1999-05-15', enrollmentNumber: '20230002', phone: '987654321', address: 'Rua B' },
];

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!id) {
      alert('ID do aluno não fornecido.');
      router.push('/students');
      return;
    }

    const student = mockStudents.find(s => s.id === id);
    if (!student) {
      alert('Aluno não encontrado.');
      router.push('/students');
      return;
    }

    setFormData(student);
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Aluno atualizado!');
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
              value={val}
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
