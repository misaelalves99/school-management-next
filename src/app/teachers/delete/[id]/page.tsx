// src/app/teachers/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { getTeacherById, deleteTeacher } from '../../../mocks/teachers';

export default function TeacherDelete() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  if (!id) return <div>Id inválido</div>;

  const teacher = getTeacherById(id);
  if (!teacher) return <div>Professor não encontrado.</div>;

  const handleDelete = () => {
    deleteTeacher(teacher.id);
    alert('Professor excluído com sucesso.');
    router.push('/teachers');
  };

  return (
    <>
      <h1 className={styles.title}>Excluir Professor</h1>
      <h3 className={styles.warning}>Tem certeza que deseja excluir este professor?</h3>

      <div className={styles.infoBox}>
        <h4>{teacher.name}</h4>
        <p>E-mail: {teacher.email}</p>
        <p>Telefone: {teacher.phone}</p>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleDelete();
        }}
        className={styles.form}
      >
        <button type="submit" className={`${styles.btn} ${styles.btnDanger}`}>
          Excluir
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => router.push('/teachers')}
        >
          Cancelar
        </button>
      </form>
    </>
  );
}
