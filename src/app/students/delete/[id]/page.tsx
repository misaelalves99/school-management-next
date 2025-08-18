// src/app/students/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';

export default function DeleteStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Aluno ${id} excluído!`);
    router.push('/students');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Aluno</h1>
      <p className={styles.warning}>
        Tem certeza que deseja excluir o aluno <strong>ID: {id}</strong>?
      </p>
      <form onSubmit={handleDelete} className={styles.form}>
        <button type="submit" className={styles.btnDelete}>Confirmar Exclusão</button>
        <button type="button" className={styles.btnCancel} onClick={() => router.push('/students')}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
