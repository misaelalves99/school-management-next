// src/app/students/details/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DetailsPage.module.css';
import { useStudents } from '../../../hooks/useStudents';

export default function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getStudentById } = useStudents();

  const numericId = Number(id); // ✅ converte string -> number
  const student = !isNaN(numericId) ? getStudentById(numericId) : undefined;

  if (!student) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Aluno não encontrado</h1>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/students')}
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Aluno</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Nome:</span>
        <span className={styles.detailsValue}>{student.name}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Email:</span>
        <span className={styles.detailsValue}>{student.email}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Data de Nascimento:</span>
        <span className={styles.detailsValue}>{student.dateOfBirth}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Número de Matrícula:</span>
        <span className={styles.detailsValue}>{student.enrollmentNumber}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Telefone:</span>
        <span className={styles.detailsValue}>{student.phone}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Endereço:</span>
        <span className={styles.detailsValue}>{student.address}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => router.push(`/students/edit/${numericId}`)}
        >
          Editar
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/students')}
        >
          Voltar à Lista
        </button>
      </div>
    </div>
  );
}
