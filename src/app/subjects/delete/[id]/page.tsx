// src/app/subjects/delete/[id]/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from './DeletePage.module.css';
import { useSubjects } from '../../../hooks/useSubjects';

export default function DeleteSubjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { getSubjectById, deleteSubject } = useSubjects();

  const subject = getSubjectById(id);
  if (!subject) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Disciplina não encontrada</h2>
        <button
          className={`${styles.btnSecondary}`}
          onClick={() => router.push('/subjects')}
        >
          Voltar
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteSubject(subject.id!);
    alert(`Disciplina "${subject.name}" excluída com sucesso!`);
    router.push('/subjects');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Disciplina</h1>
      <p className={styles.warning}>Tem certeza que deseja excluir esta disciplina?</p>

      {/* Caixa de informações da disciplina */}
      <div className={styles.subjectBox}>
        <h4>{subject.name}</h4>
        <p>Carga Horária: {subject.workloadHours ?? 'N/A'} horas</p>
        <p>Descrição: {subject.description ?? 'Sem descrição'}</p>
      </div>

      {/* Botões de ação */}
      <form
        className={styles.form || styles.actions} // fallback se .form não existir
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
      >
        <button type="submit" className={styles.btnDanger}>
          Excluir
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => router.push('/subjects')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
