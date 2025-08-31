// src/app/subjects/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useSubjects } from '../../../hooks/useSubjects';

export default function DeleteSubjectPage() {
  const params = useParams();
  const router = useRouter();
  const { subjects, deleteSubject } = useSubjects();

  const id = params?.id ? Number(params.id) : null;
  if (!id) return <div>ID inválido</div>;

  const subject = subjects.find(s => s.id === id);
  if (!subject) return <div>Disciplina não encontrada</div>;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    deleteSubject(subject.id);
    router.push('/subjects');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Disciplina</h1>

      <h3 className={styles.warning}>
        Tem certeza que deseja excluir <strong>{subject.name}</strong>?
      </h3>

      {/* Botões de ação */}
      <form onSubmit={handleDelete}>
        <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.btnDelete}`}>
            Excluir
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={() => router.push('/subjects')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
