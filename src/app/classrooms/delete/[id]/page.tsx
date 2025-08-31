// src/app/classrooms/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useClassRooms } from '@/app/hooks/useClassRooms';

export default function DeleteClassRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { classRooms, deleteClassRoom } = useClassRooms();

  const id = params?.id ? Number(params.id) : null;
  if (!id) return <div>ID inválido</div>;

  const classRoom = classRooms.find(c => c.id === id);
  if (!classRoom) return <div>Turma não encontrada</div>;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    deleteClassRoom(classRoom.id);
    router.push('/classrooms');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Turma</h1>

      <h3 className={styles.warning}>
        Tem certeza que deseja excluir <strong>{classRoom.name}</strong>?
      </h3>

      <form onSubmit={handleDelete}>
        <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.btnDelete}`}>
            Excluir
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={() => router.push('/classrooms')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
