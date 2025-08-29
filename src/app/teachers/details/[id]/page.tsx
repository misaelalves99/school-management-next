// src/app/teachers/details/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DetailsPage.module.css';
import { useTeachers } from '../../../hooks/useTeachers';

export default function TeacherDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getTeacherById } = useTeachers();

  const numericId = Number(id);
  const teacher = !isNaN(numericId) ? getTeacherById(numericId) : undefined;

  if (!teacher) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Professor não encontrado</h1>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/teachers')}
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  const formattedDate = new Date(teacher.dateOfBirth).toLocaleDateString();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Professor</h1>

      {/* Bloco de detalhes */}
      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Nome:</span>
        <span className={styles.detailsValue}>{teacher.name}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Email:</span>
        <span className={styles.detailsValue}>{teacher.email}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Data de Nascimento:</span>
        <span className={styles.detailsValue}>{formattedDate}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Disciplina:</span>
        <span className={styles.detailsValue}>{teacher.subject}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Telefone:</span>
        <span className={styles.detailsValue}>{teacher.phone}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Endereço:</span>
        <span className={styles.detailsValue}>{teacher.address}</span>
      </div>

      {/* Botões */}
      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => router.push(`/teachers/edit/${numericId}`)}
        >
          Editar
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/teachers')}
        >
          Voltar à Lista
        </button>
      </div>
    </div>
  );
}
