// src/app/teachers/details/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './DetailsPage.module.css';
import { useTeachers } from '../../../hooks/useTeachers';

export default function TeacherDetails() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const { getTeacherById } = useTeachers();

  if (!id) return <div>Id inválido</div>;

  const teacher = getTeacherById(id);
  if (!teacher) return <div>Professor não encontrado.</div>;

  const formattedDate = new Date(teacher.dateOfBirth).toLocaleDateString();

  return (
    <>
      <h1 className={styles.title}>Detalhes do Professor</h1>
      <div className={styles.container}>
        {teacher.photoUrl && (
          <Image
            src={teacher.photoUrl}
            alt={`${teacher.name} foto`}
            width={150}
            height={150}
            className={styles['profile-photo']}
          />
        )}
        <div><strong>Nome:</strong> {teacher.name}</div>
        <div><strong>Email:</strong> {teacher.email}</div>
        <div><strong>Data de Nascimento:</strong> {formattedDate}</div>
        <div><strong>Disciplina:</strong> {teacher.subject}</div>
        <div><strong>Telefone:</strong> {teacher.phone}</div>
        <div><strong>Endereço:</strong> {teacher.address}</div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles['btn-warning']}`}
            onClick={() => router.push(`/teachers/edit/${teacher.id}`)}
          >
            Editar
          </button>
          <button
            className={`${styles.btn} ${styles['btn-secondary']}`}
            onClick={() => router.push('/teachers')}
          >
            Voltar à Lista
          </button>
        </div>
      </div>
    </>
  );
}
