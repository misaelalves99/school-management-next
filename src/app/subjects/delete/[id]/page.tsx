// src/app/subjects/delete/[id]/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from './DeletePage.module.css';

export default function DeleteSubjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const handleDelete = () => {
    console.log('Excluir disciplina com ID:', id); // Aqui faria a chamada à API
    router.push('/subjects');
  };

  return (
    <>
      <h1 className={styles.title}>Excluir Disciplina</h1>
      <h3 className={styles.warning}>Tem certeza que deseja excluir esta disciplina?</h3>

      <div className={styles.subjectBox}>
        <h4>Nome da Disciplina (simulado)</h4>
        <p>Carga Horária: 60 horas</p>
      </div>

      <form className={styles.form}>
        <button type="button" className={styles.btnDanger} onClick={handleDelete}>Excluir</button>
        <button type="button" className={styles.btnSecondary} onClick={() => router.push('/subjects')}>Cancelar</button>
      </form>
    </>
  );
}
