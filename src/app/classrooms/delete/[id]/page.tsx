// src/app/classrooms/delete/[id]/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from './DeletePage.module.css';
import mockClassRooms from '../../../mocks/classRooms';

import type { ClassRoom } from '../../../types/Classroom';

const DeleteClassRoomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const classRoomId = Number(params.id);
  const classRoom: ClassRoom | undefined = mockClassRooms.find((c) => c.id === classRoomId);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Excluir turma com id', classRoom.id);
    // Implementar exclusão real via API
    router.push('/classrooms');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Turma</h1>
      <p className={styles.warning}>Tem certeza que deseja excluir esta turma?</p>

      <dl className={styles.details}>
        <dt>Nome</dt>
        <dd>{classRoom.name}</dd>

        <dt>Capacidade</dt>
        <dd>{classRoom.capacity}</dd>

        <dt>Horário</dt>
        <dd>{classRoom.schedule}</dd>

        <dt>Disciplinas</dt>
        <dd>
          {classRoom.subjects?.length ? (
            <ul>{classRoom.subjects.map((s) => <li key={s.id}>{s.name}</li>)}</ul>
          ) : (
            <span className={styles.muted}>Sem disciplinas vinculadas.</span>
          )}
        </dd>

        <dt>Professores</dt>
        <dd>
          {classRoom.teachers?.length ? (
            <ul>{classRoom.teachers.map((t) => <li key={t.id}>{t.name}</li>)}</ul>
          ) : (
            <span className={styles.muted}>Sem professores vinculados.</span>
          )}
        </dd>
      </dl>

      <form onSubmit={handleSubmit} className={styles.form}>
        <button type="submit" className={styles.btnDanger}>
          Confirmar Exclusão
        </button>
        <button type="button" className={styles.btnSecondary} onClick={() => router.push('/classrooms')}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default DeleteClassRoomPage;
