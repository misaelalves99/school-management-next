// src/app/enrollments/details/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './DetailsPage.module.css';
import { useEnrollments } from '../../../hooks/useEnrollments';
import { useStudents } from '../../../hooks/useStudents';
import { useClassRooms } from '../../../hooks/useClassRooms';

interface EnrollmentDetails {
  id: number;
  studentName: string;
  classRoomName: string;
  status: string;
  enrollmentDate: string;
}

export default function EnrollmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { enrollments } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();
  const [enrollment, setEnrollment] = useState<EnrollmentDetails | null>(null);

  useEffect(() => {
    if (!id) return;

    const enrollmentId = Number(id);
    const enrollmentData = enrollments.find(e => e.id === enrollmentId);

    if (!enrollmentData) {
      alert('Matrícula não encontrada');
      router.push('/enrollments');
      return;
    }

    const student = students.find(s => s.id === enrollmentData.studentId);
    const classRoom = classRooms.find(c => c.id === enrollmentData.classRoomId);

    setEnrollment({
      id: enrollmentData.id,
      studentName: student?.name ?? 'Aluno não informado',
      classRoomName: classRoom?.name ?? 'Turma não informada',
      status: enrollmentData.status ?? '-',
      enrollmentDate: enrollmentData.enrollmentDate,
    });
  }, [id, enrollments, students, classRooms, router]);

  if (!enrollment) return <div>Carregando matrícula...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes da Matrícula</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Aluno:</span>
        <span className={styles.detailsValue}>{enrollment.studentName}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Turma:</span>
        <span className={styles.detailsValue}>{enrollment.classRoomName}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Status:</span>
        <span className={styles.detailsValue}>{enrollment.status}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Data da Matrícula:</span>
        <span className={styles.detailsValue}>
          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => router.push(`/enrollments/edit/${enrollment.id}`)}
        >
          Editar
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/enrollments')}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
