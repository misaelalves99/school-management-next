// src/app/enrollments/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useEnrollments } from '@/app/hooks/useEnrollments';
import { useStudents } from '@/app/hooks/useStudents';
import { useClassRooms } from '@/app/hooks/useClassRooms';

const DeleteEnrollmentPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const enrollmentId = Number(params.id);

  const { enrollments, deleteEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  // Busca a matrícula pelo ID
  const enrollment = enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) return <p>Matrícula não encontrada.</p>;

  const student = students.find((s) => s.id === enrollment.studentId);
  const classRoom = classRooms.find((c) => c.id === enrollment.classRoomId);

  const handleDelete = () => {
    deleteEnrollment(enrollmentId);
    alert('Matrícula excluída com sucesso!');
    router.push('/enrollments');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Matrícula</h1>
      <p className={styles.warning}>
        Tem certeza que deseja excluir esta matrícula?
      </p>

      <div className={styles.infoBox}>
        <p><strong>Aluno:</strong> {student?.name ?? 'Aluno não informado'}</p>
        <p><strong>Turma:</strong> {classRoom?.name ?? 'Turma não informada'}</p>
        <p><strong>Status:</strong> {enrollment.status}</p>
        <p><strong>Data da Matrícula:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
      </div>

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete}>
          Excluir
        </button>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.push('/enrollments')}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteEnrollmentPage;
