// src/app/teachers/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useTeachers } from '../../../hooks/useTeachers';

export default function DeleteTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const { teachers, deleteTeacher } = useTeachers();

  const id = params?.id ? Number(params.id) : null;

  if (!id) return <div>ID inválido</div>;

  const teacher = teachers.find(t => t.id === id);
  if (!teacher) return <div>Professor não encontrado</div>;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    deleteTeacher(teacher.id);
    router.push('/teachers');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Professor</h1>

      <h3 className={styles.warning}>
        Tem certeza que deseja excluir <strong>{teacher.name}</strong>?
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
            onClick={() => router.push('/teachers')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
