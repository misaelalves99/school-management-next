// src/app/subjects/details/[id]/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from './DetailsPage.module.css';
import { useSubjects } from '../../../hooks/useSubjects';

export default function SubjectDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const subjectId = Number(params.id);

  const { getSubjectById } = useSubjects();
  const subject = getSubjectById(subjectId);

  if (!subject) {
    return (
      <div className={styles.container}>
        <h2>Disciplina não encontrada.</h2>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => router.push('/subjects')}
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Detalhes da Disciplina</h1>

      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.label}>Nome</div>
          <div className={styles.value}>{subject.name}</div>

          <div className={styles.label}>Carga Horária</div>
          <div className={styles.value}>{subject.workloadHours ?? 'N/A'} horas</div>

          <div className={styles.label}>Descrição</div>
          <div className={styles.value}>{subject.description}</div>
        </div>
      </div>

      <button
        className={`${styles.btn} ${styles.btnWarning}`}
        onClick={() => router.push(`/subjects/edit/${subject.id}`)}
      >
        Editar
      </button>

      <button
        className={`${styles.btn} ${styles.btnSecondary}`}
        onClick={() => router.push('/subjects')}
      >
        Voltar
      </button>
    </>
  );
}
