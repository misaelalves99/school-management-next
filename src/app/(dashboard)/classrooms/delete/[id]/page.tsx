// src/app/(dashboard)/classrooms/delete/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

import styles from './DeletePage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useClassRooms } from '@/core/hooks/useClassRooms';

type ClassRoomSummary = {
  id: number;
  name: string;
  schedule?: string;
};

type LoadStatus = 'loading' | 'invalid' | 'not-found' | 'ready' | 'deleting';

export default function DeleteClassRoomPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { findById, deleteClassRoom } = useClassRooms();

  const numericId = Number(params?.id);

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [classRoom, setClassRoom] = useState<ClassRoomSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) {
      setStatus('invalid');
      return;
    }

    const found = findById(numericId);

    if (!found) {
      setStatus('not-found');
      return;
    }

    setClassRoom({
      id: found.id,
      name: found.name,
      schedule: found.schedule,
    });

    setStatus('ready');
  }, [numericId, findById]);

  const goBackToList = (): void => {
    router.push('/classrooms');
  };

  const handleConfirmDelete = (): void => {
    if (!numericId || Number.isNaN(numericId)) {
      setStatus('invalid');
      return;
    }

    if (!classRoom) return;

    try {
      setStatus('deleting');
      deleteClassRoom(classRoom.id);
      router.push('/classrooms');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        'Não foi possível remover a turma. Tente novamente em instantes.',
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
            Buscando informações da turma para confirmar a exclusão.
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
            O identificador informado não é válido. Volte para a lista de turmas
            e tente novamente.
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

  if (status === 'not-found' || !classRoom) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Turma não encontrada</p>
          <p className={styles.stateSubtitle}>
            Não foi possível localizar uma turma com este identificador. Ela
            pode ter sido removida recentemente.
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

  // ===== Conteúdo principal =====

  return (
    <div className={styles.page}>
      {/* Header alinhado com DeleteTeacher/DeleteSubject/DeleteStudent */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaExclamationTriangle className={styles.titleIcon} />
            </span>
            Remover turma
          </h1>

          <p className={styles.subtitle}>
            Esta operação remove permanentemente o cadastro da turma da sua base
            de dados operacional. Verifique com cuidado antes de confirmar, pois
            isso afeta a organização da grade e das matrículas.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Badge variant="danger">Ação irreversível</Badge>
        </div>
      </header>

      <Card>
        <div className={styles.content}>
          {/* Bloco de aviso principal */}
          <div className={styles.warningBlock}>
            <div className={styles.warningIcon} aria-hidden="true">
              !
            </div>
            <div className={styles.warningText}>
              <p className={styles.warningTitle}>
                Tem certeza que deseja remover esta turma?
              </p>
              <p className={styles.warningSubtitle}>
                Após a confirmação, o registro será excluído e não poderá ser
                restaurado pela interface do sistema. Em um cenário real, o
                ideal é revisar matrículas e alocações de alunos antes de
                concluir esta ação.
              </p>
            </div>
          </div>

          {/* Resumo da turma */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div>
                <p className={styles.summaryLabel}>Turma</p>
                <p className={styles.summaryName}>{classRoom.name}</p>
              </div>
              <span className={styles.summaryId}>#{classRoom.id}</span>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Horário / turno</span>
                <span className={styles.summaryItemValue}>
                  {classRoom.schedule || 'Não informado'}
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
