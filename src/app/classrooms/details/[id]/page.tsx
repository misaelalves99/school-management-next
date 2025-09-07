// src/app/classrooms/details/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DetailsPage.module.css';
import { useClassRooms } from '@/app/hooks/useClassRooms';

export default function ClassRoomDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getClassRoomById } = useClassRooms();

  const numericId = Number(id);
  const classRoom = getClassRoomById(numericId);

  if (!classRoom) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Turma não encontrada</h1>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/classrooms')}
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes da Turma</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Nome:</span>
        <span className={styles.detailsValue}>{classRoom.name}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Capacidade:</span>
        <span className={styles.detailsValue}>{classRoom.capacity}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Horário:</span>
        <span className={styles.detailsValue}>{classRoom.schedule}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => router.push(`/classrooms/edit/${numericId}`)}
        >
          Editar
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/classrooms')}
        >
          Voltar à Lista
        </button>
      </div>
    </div>
  );
}
