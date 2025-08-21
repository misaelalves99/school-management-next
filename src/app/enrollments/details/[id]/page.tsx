// src/app/enrollments/details/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import mockEnrollments from '../../../mocks/enrollments';
import mockStudents from '../../../mocks/students';
import mockClassRooms from '../../../mocks/classRooms';
import styles from './DetailsPage.module.css';

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
  const [enrollment, setEnrollment] = useState<EnrollmentDetails | null>(null);

  useEffect(() => {
    if (!id) return;

    const enrollmentId = Number(id);
    const enrollmentData = mockEnrollments.find(
      (e): e is typeof mockEnrollments[number] => e.id === enrollmentId
    );

    if (!enrollmentData) {
      alert('Matrícula não encontrada');
      router.push('/enrollments');
      return;
    }

    const student = mockStudents.find((s) => s.id === enrollmentData.studentId);
    const classRoom = mockClassRooms.find((c) => c.id === enrollmentData.classRoomId);

    setEnrollment({
      id: enrollmentData.id,
      studentName: student?.name ?? 'Aluno não informado',
      classRoomName: classRoom?.name ?? 'Turma não informada',
      status: enrollmentData.status ?? '-',
      enrollmentDate: enrollmentData.enrollmentDate,
    });
  }, [id, router]);

  if (!enrollment) return <div>Carregando matrícula...</div>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Detalhes da Matrícula</h1>

      <div className={styles.detailsContainer}>
        <dl className={styles.dlRow}>
          <div className={styles.row}>
            <dt className={styles.dt}>Aluno</dt>
            <dd className={styles.dd}>{enrollment.studentName}</dd>
          </div>

          <div className={styles.row}>
            <dt className={styles.dt}>Turma</dt>
            <dd className={styles.dd}>{enrollment.classRoomName}</dd>
          </div>

          <div className={styles.row}>
            <dt className={styles.dt}>Status</dt>
            <dd className={styles.dd}>{enrollment.status}</dd>
          </div>

          <div className={styles.row}>
            <dt className={styles.dt}>Data da Matrícula</dt>
            <dd className={styles.dd}>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.buttonsContainer}>
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
