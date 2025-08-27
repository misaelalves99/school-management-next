// src/app/classrooms/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';
import { useClassRooms } from '@/app/hooks/useClassRooms';

const ClassRoomCreate: React.FC = () => {
  const router = useRouter();
  const { createClassRoom } = useClassRooms();

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [errors, setErrors] = useState<{ name?: string; capacity?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!capacity || capacity < 1 || capacity > 100)
      newErrors.capacity = 'Capacidade deve ser entre 1 e 100.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Cria a nova sala usando o contexto
    createClassRoom({
      name,
      capacity,
      schedule: '', // ou algum padrão
      subjects: [],
      teachers: [],
      classTeacher: null,
    });

    // Redireciona para a lista
    router.push('/classrooms');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.title}>Cadastrar Nova Sala</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          {errors.name && <span className={styles.textDanger}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacity" className={styles.label}>Capacidade</label>
          <input
            id="capacity"
            type="number"
            min={1}
            max={100}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className={styles.input}
          />
          {errors.capacity && <span className={styles.textDanger}>{errors.capacity}</span>}
        </div>

        <button type="submit" className={styles.submitButton}>Salvar</button>
      </form>

      <button
        type="button"
        className={styles.btnSecondary}
        onClick={() => router.push('/classrooms')}
      >
        Voltar à Lista
      </button>
    </div>
  );
};

export default ClassRoomCreate;
