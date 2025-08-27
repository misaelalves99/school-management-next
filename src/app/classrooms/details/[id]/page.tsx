// src/app/classrooms/details/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DetailsPage.module.css';
import { useClassRooms } from '@/app/hooks/useClassRooms';

const ClassRoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getClassRoomById } = useClassRooms();

  const classRoomId = Number(id);
  const classRoom = getClassRoomById(classRoomId);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes da Turma</h1>

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
            <ul>
              {classRoom.subjects.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.muted}>Sem disciplinas vinculadas.</span>
          )}
        </dd>

        <dt>Professores</dt>
        <dd>
          {classRoom.teachers?.length ? (
            <ul>
              {classRoom.teachers.map((t) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.muted}>Sem professores vinculados.</span>
          )}
        </dd>

        <dt>Professor Responsável</dt>
        <dd>{classRoom.classTeacher?.name ?? 'Não definido'}</dd>
      </dl>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnWarning}`}
          onClick={() => router.push(`/classrooms/edit/${classRoom.id}`)}
        >
          Editar
        </button>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => router.push('/classrooms')}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default ClassRoomDetailsPage;
