// /src/app/classrooms/[id]/edit/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EditPage.module.css';
import { useClassRooms } from '@/app/hooks/useClassRooms';
import type { ClassRoom } from '@/app/types/Classroom';
import type { Subject } from '@/app/types/Subject';
import type { Teacher } from '@/app/types/Teacher';

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
    subjects: [] as Subject[],
    teachers: [] as Teacher[],
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
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Editar Sala</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.inputField}
            type="text"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="capacity">Capacidade</label>
          <input
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className={styles.inputField}
            type="number"
            min={1}
            max={100}
          />
        </div>

        <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
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
}
