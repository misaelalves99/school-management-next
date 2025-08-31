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
  const [schedule, setSchedule] = useState('');
  const [errors, setErrors] = useState<{ name?: string; capacity?: string; schedule?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!capacity || capacity < 1 || capacity > 100)
      newErrors.capacity = 'Capacidade deve ser entre 1 e 100.';
    if (!schedule.trim()) newErrors.schedule = 'Horário é obrigatório.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createClassRoom({
      name,
      capacity,
      schedule,
      subjects: [],
      teachers: [],
      classTeacher: null,
    });

    router.push('/classrooms');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Cadastrar Nova Sala</h1>

      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.formInput}
          />
          {errors.name && <span className={styles.formError}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacity" className={styles.formLabel}>Capacidade</label>
          <input
            id="capacity"
            type="number"
            min={1}
            max={100}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className={styles.formInput}
          />
          {errors.capacity && <span className={styles.formError}>{errors.capacity}</span>}
        </div>

        {/* Novo campo horário */}
        <div className={styles.formGroup}>
          <label htmlFor="schedule" className={styles.formLabel}>Horário</label>
          <input
            id="schedule"
            type="text"
            placeholder="Ex: Seg-Qua 08:00-10:00"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className={styles.formInput}
          />
          {errors.schedule && <span className={styles.formError}>{errors.schedule}</span>}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push('/classrooms')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassRoomCreate;
