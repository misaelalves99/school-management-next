// src/app/(dashboard)/students/delete/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

import styles from './DeletePage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useStudents } from '@/core/hooks/useStudents';
import type { Student } from '@/types/Student';

type LoadStatus = 'loading' | 'invalid' | 'not-found' | 'ready' | 'deleting';

export default function StudentDeletePage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getStudentById, deleteStudent } = useStudents();

  const studentId = Number(params.id);

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [student, setStudent] = useState<Student | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId || Number.isNaN(studentId)) {
      setStatus('invalid');
      return;
    }

    const found = getStudentById(studentId);
    if (!found) {
      setStatus('not-found');
      return;
    }

    setStudent(found);
    setStatus('ready');
  }, [studentId, getStudentById]);

  const goBackToList = (): void => {
    router.push('/students');
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!studentId || Number.isNaN(studentId)) {
      setStatus('invalid');
      return;
    }

    try {
      setStatus('deleting');
      await deleteStudent(studentId);
      router.push('/students');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        'Ocorreu um erro ao remover o aluno. Tente novamente em instantes.',
      );
      setStatus('ready');
    }
  };

  const isDeleting = status === 'deleting';

  // ===== Estados especiais =====

  if (status === 'loading') {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Carregando dados...</p>
          <p className={styles.stateSubtitle}>
            Buscando informações do aluno para confirmar a exclusão.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>ID inválido</p>
          <p className={styles.stateSubtitle}>
            O identificador informado não é válido. Volte para a lista de
            alunos e tente novamente.
          </p>
          <div className={styles.stateActions}>
            <Button variant="primary" size="sm" onClick={goBackToList}>
              Voltar para a lista
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'not-found' || !student) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Aluno não encontrado</p>
          <p className={styles.stateSubtitle}>
            Não foi possível localizar um aluno com este identificador. Ele
            pode ter sido removido recentemente.
          </p>
          <div className={styles.stateActions}>
            <Button variant="primary" size="sm" onClick={goBackToList}>
              Voltar para a lista
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { id, name, email, phone, enrollmentNumber } = student;

  // ===== Conteúdo principal =====

  return (
    <div className={styles.page}>
      {/* Header alinhado ao layout de DeleteTeacher */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaExclamationTriangle className={styles.titleIcon} />
            </span>
            Remover aluno
          </h1>

          <p className={styles.subtitle}>
            Esta operação remove permanentemente o cadastro do aluno da sua base
            de dados operacional. Verifique com cuidado antes de confirmar.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Badge variant="danger">Ação irreversível</Badge>
        </div>
      </header>

      <Card>
        <div className={styles.content}>
          <div className={styles.warningBlock}>
            <div className={styles.warningIcon} aria-hidden="true">
              !
            </div>
            <div className={styles.warningText}>
              <p className={styles.warningTitle}>
                Tem certeza que deseja remover este aluno?
              </p>
              <p className={styles.warningSubtitle}>
                Após a confirmação, o registro será excluído e não poderá ser
                restaurado pela interface do sistema.
              </p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div>
                <p className={styles.summaryLabel}>Aluno</p>
                <p className={styles.summaryName}>{name}</p>
              </div>
              <span className={styles.summaryId}>#{id}</span>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Email</span>
                <span className={styles.summaryItemValue}>
                  {email || 'Não informado'}
                </span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Telefone</span>
                <span className={styles.summaryItemValue}>
                  {phone || 'Não informado'}
                </span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>
                  Matrícula / Documento
                </span>
                <span className={styles.summaryItemValue}>
                  {enrollmentNumber || 'Não informado'}
                </span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          )}

          <div className={styles.actionsRow}>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={goBackToList}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removendo...' : 'Confirmar exclusão'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
