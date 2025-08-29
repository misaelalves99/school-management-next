// src/app/students/delete/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useStudents } from '../../../hooks/useStudents';

export default function DeleteStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { deleteStudent } = useStudents();

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      deleteStudent(numericId);
      router.push('/students');
    } else {
      console.error("ID inválido:", id);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Aluno</h1>

      <p className={styles.warning}>
        Tem certeza que deseja excluir o aluno <strong>ID: {id}</strong>?
      </p>

      {/* Caixa de informações adicionais */}
      <div className={styles.infoBox}>
        <h4>Atenção:</h4>
        <p>Essa ação é <strong>irreversível</strong>. Todos os dados do aluno serão removidos do sistema.</p>
      </div>

      {/* Botões de ação */}
      <form onSubmit={handleDelete}>
        <div className={styles.actions}>
          <button type="submit" className={styles.btnDelete}>
            Confirmar Exclusão
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
