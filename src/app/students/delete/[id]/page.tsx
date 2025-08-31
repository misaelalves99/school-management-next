'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useStudents } from '../../../hooks/useStudents';

export default function DeleteStudentPage() {
  const params = useParams();
  const router = useRouter();
  const { students, deleteStudent } = useStudents();

  const id = params?.id ? Number(params.id) : null;
  if (!id) return <div>ID inválido</div>;

  const student = students.find(s => s.id === id);
  if (!student) return <div>Aluno não encontrado</div>;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    const studentId: number = student.id!;
    deleteStudent(studentId);
    alert(`Aluno "${student.name}" excluído com sucesso!`);
    router.push('/students');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Aluno</h1>
      <h3 className={styles.warning}>
        Tem certeza que deseja excluir <strong>{student.name}</strong>?
      </h3>

      <form onSubmit={handleDelete}>
        <div className={styles.actions}>
          <button type="submit" className={styles.btnDelete}>
            Excluir
          </button>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={() => router.push('/students')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
