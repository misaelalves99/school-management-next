// /src/app/classrooms/[id]/edit/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EditPage.module.css';
import { useClassRooms } from '@/app/hooks/useClassRooms';
import type { ClassRoom } from '@/app/types/Classroom';

interface PageProps {
  params: { id: string };
}

export default function EditClassRoomPage({ params }: PageProps) {
  const router = useRouter();
  const { getClassRoomById, updateClassRoom } = useClassRooms();
  const id = Number(params.id);

  const [formData, setFormData] = useState<Omit<ClassRoom, 'id'>>({
    name: '',
    capacity: 0,
    schedule: '',
    subjects: [],
    teachers: [],
    classTeacher: null,
  });

  useEffect(() => {
    const classRoom = getClassRoomById(id);
    if (!classRoom) {
      alert('Sala não encontrada');
      router.push('/classrooms');
    } else {
      setFormData({
        name: classRoom.name,
        capacity: classRoom.capacity,
        schedule: classRoom.schedule,
        subjects: classRoom.subjects || [],
        teachers: classRoom.teachers || [],
        classTeacher: classRoom.classTeacher || null,
      });
    }
  }, [id, getClassRoomById, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClassRoom(id, formData);
    router.push('/classrooms');
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Editar Sala</h1>

      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.formInput}
            type="text"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="capacity">Capacidade</label>
          <input
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className={styles.formInput}
            type="number"
            min={1}
            max={100}
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push('/classrooms')}
          >
            Voltar à Lista
          </button>
        </div>
      </form>
    </div>
  );
}
