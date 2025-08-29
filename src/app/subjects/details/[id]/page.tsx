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
        <h1 className={styles.title}>Disciplina não encontrada</h1>
        <div className={styles.actions}>
          <button
            className={styles.btnSecondary}
            onClick={() => router.push('/subjects')}
          >
            Voltar à Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes da Disciplina</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Nome:</span>
        <span className={styles.detailsValue}>{subject.name}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Carga Horária:</span>
        <span className={styles.detailsValue}>
          {subject.workloadHours ? `${subject.workloadHours} horas` : 'N/A'}
        </span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Descrição:</span>
        <span className={styles.detailsValue}>
          {subject.description || <span className={styles.muted}>Sem descrição</span>}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => router.push(`/subjects/edit/${subject.id}`)}
        >
          Editar
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/subjects')}
        >
          Voltar à Lista
        </button>
      </div>
    </div>
  );
}
