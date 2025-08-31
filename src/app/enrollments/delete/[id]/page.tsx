// src/app/enrollments/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useEnrollments } from '@/app/hooks/useEnrollments';
import { useStudents } from '@/app/hooks/useStudents';
import { useClassRooms } from '@/app/hooks/useClassRooms';

export default function DeleteEnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? Number(params.id) : null;
  const { enrollments, deleteEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  if (!id) return <div>ID inválido</div>;

  const enrollment = enrollments.find(e => e.id === id);
  if (!enrollment) return <div>Matrícula não encontrada</div>;

  const student = students.find(s => s.id === enrollment.studentId);
  const classRoom = classRooms.find(c => c.id === enrollment.classRoomId);

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    deleteEnrollment(id);
    alert('Matrícula excluída com sucesso!');
    router.push('/enrollments');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Matrícula</h1>

      <h3 className={styles.warning}>
        Tem certeza que deseja excluir a matrícula de <strong>{student?.name ?? 'Aluno desconhecido'}</strong>?
      </h3>

      <form onSubmit={handleDelete}>
        <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.btnDelete}`}>
            Excluir
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={() => router.push('/enrollments')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
