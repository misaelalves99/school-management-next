// /src/app/classrooms/[id]/edit/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './EditPage.module.css';
import type { ClassRoom } from '../../../types/Classroom';
import mockClassRooms from '../../../mocks/classRooms'; // default import

interface PageProps {
  params: { id: string };
}

export default function EditClassRoomPage({ params }: PageProps) {
  const router = useRouter();
  const id = Number(params.id);
  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
  const [formData, setFormData] = useState({ name: '', capacity: 0 });

  useEffect(() => {
    const found: ClassRoom | undefined = mockClassRooms.find(
      (c: ClassRoom) => c.id === id
    );

    if (!found) {
      alert('Sala não encontrada');
      router.push('/classrooms');
    } else {
      setClassRoom(found);
      setFormData({ name: found.name, capacity: found.capacity });
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classRoom) return;

    // Atualiza o mock (substitua pelo seu service real)
    const index = mockClassRooms.findIndex((c: ClassRoom) => c.id === classRoom.id);
    if (index !== -1) {
      mockClassRooms[index] = { ...mockClassRooms[index], ...formData };
    }

    router.push('/classrooms');
  };

  if (!classRoom) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Editar Sala</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">
            Nome
          </label>
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
          <label className={styles.label} htmlFor="capacity">
            Capacidade
          </label>
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

        <button type="submit" className={styles.btnPrimary}>
          Salvar Alterações
        </button>
      </form>

      <Link href="/classrooms" className={styles.btnSecondary}>
        Voltar à Lista
      </Link>
    </div>
  );
}
