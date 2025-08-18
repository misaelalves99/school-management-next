// src/app/classrooms/[id]/edit/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './EditPage.module.css';

type Props = {
  id: number;
  name: string;
  capacity: number;
  onSubmit: (data: { id: number; name: string; capacity: number }) => void;
};

const EditClassRoom: React.FC<Props> = ({ id, name, capacity, onSubmit }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name, capacity });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id, ...formData });
    router.push('/classrooms'); // redireciona após salvar
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Editar Sala</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" value={id} />

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

        <button type="submit" className={styles.btnPrimary}>
          Salvar Alterações
        </button>
      </form>

      <Link href="/classrooms" className={styles.btnSecondary}>
        Voltar à Lista
      </Link>
    </div>
  );
};

export default EditClassRoom;
