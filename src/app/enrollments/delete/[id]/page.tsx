// src/app/classrooms/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import mockClassRooms from '../../../mocks/classRooms';

const ClassRoomDeletePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  if (!id) return <p>Turma inválida.</p>;

  const classRoomId = Number(id);
  const classRoom = mockClassRooms.find((c) => c.id === classRoomId);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  const handleDelete = () => {
    const index = mockClassRooms.findIndex((c) => c.id === classRoomId);
    if (index !== -1) {
      mockClassRooms.splice(index, 1); // Remove do mock
    }
    router.push('/classrooms'); // Volta para lista
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Turma</h1>

      <p>
        Tem certeza que deseja excluir a turma <strong>{classRoom.name}</strong>?
      </p>

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete}>
          Excluir
        </button>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.push('/classrooms')}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ClassRoomDeletePage;
