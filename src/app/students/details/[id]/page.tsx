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
        <button className={styles.btnSecondary} onClick={() => router.push('/students')}>
          Voltar à Lista
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Aluno</h1>
      <div><strong>Nome:</strong> {student.name}</div>
      <div><strong>Email:</strong> {student.email}</div>
      <div><strong>Data de Nascimento:</strong> {student.dateOfBirth}</div>
      <div><strong>Número de Matrícula:</strong> {student.enrollmentNumber}</div>
      <div><strong>Telefone:</strong> {student.phone}</div>
      <div><strong>Endereço:</strong> {student.address}</div>
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
