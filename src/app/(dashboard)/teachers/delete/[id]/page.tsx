// src/app/(dashboard)/teachers/delete/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

import styles from './DeletePage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useTeachers } from '@/core/hooks/useTeachers';
import type { Teacher } from '@/types/Teacher';

type LoadStatus = 'loading' | 'invalid' | 'not-found' | 'ready' | 'deleting';

export default function TeacherDeletePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getTeacherById, removeTeacher } = useTeachers();

  const teacherId = Number(params.id);

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId || Number.isNaN(teacherId)) {
      setStatus('invalid');
      return;
    }

    const found = getTeacherById(teacherId);
    if (!found) {
      setStatus('not-found');
      return;
    }

    setTeacher(found);
    setStatus('ready');
  }, [teacherId, getTeacherById]);

  const goBackToList = () => {
    router.push('/teachers');
  };

  const handleConfirmDelete = () => {
    if (!teacherId || Number.isNaN(teacherId)) {
      setStatus('invalid');
      return;
    }

    try {
      setStatus('deleting');
      removeTeacher(teacherId);
      router.push('/teachers');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        'Ocorreu um erro ao remover o professor. Tente novamente em instantes.',
      );
      setStatus('ready');
    }
  };

  // ===== Estados especiais =====

  if (status === 'loading') {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Carregando dados...</p>
          <p className={styles.stateSubtitle}>
            Buscando informações do professor para confirmar a exclusão.
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
            professores e tente novamente.
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

  if (status === 'not-found' || !teacher) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Professor não encontrado</p>
          <p className={styles.stateSubtitle}>
            Não foi possível localizar um professor com este identificador. Ele
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

  const { id, name, email, subject } = teacher;

  const isDeleting = status === 'deleting';

  // ===== Conteúdo principal =====

  return (
    <div className={styles.page}>
      {/* Header alinhado ao layout de CreateTeacher */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaExclamationTriangle className={styles.titleIcon} />
            </span>
            Remover professor
          </h1>

          <p className={styles.subtitle}>
            Esta operação remove permanentemente o cadastro do professor da sua
            base de dados. Verifique com cuidado antes de confirmar.
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
                Tem certeza que deseja remover este professor?
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
                <p className={styles.summaryLabel}>Professor</p>
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
                <span className={styles.summaryItemLabel}>Disciplina</span>
                <span className={styles.summaryItemValue}>
                  {subject || 'Não informado'}
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
