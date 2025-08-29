// src/app/teachers/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useTeachers } from '../../../hooks/useTeachers';

export default function TeacherDelete() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const { getTeacherById, deleteTeacher } = useTeachers();

  if (!id) return <div>Id inválido</div>;

  const teacher = getTeacherById(id);
  if (!teacher) return <div>Professor não encontrado.</div>;

  const handleDelete = () => {
    deleteTeacher(teacher.id);
    alert('Professor excluído com sucesso.');
    router.push('/teachers');
  };

  return (
    <div>
      <h1 className={styles.title}>Excluir Professor</h1>
      <p className={styles.warning}>
        Tem certeza que deseja excluir este professor?
      </p>

      {/* Caixa de informações do professor */}
      <div className={styles.infoBox}>
        <h4>{teacher.name}</h4>
        <p>E-mail: {teacher.email}</p>
        <p>Telefone: {teacher.phone}</p>
      </div>

      {/* Botões de ação */}
      <form
        onSubmit={(e) => {
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
    </div>
  );
}
