// src/app/(dashboard)/subjects/delete/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

import styles from './DeletePage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useSubjects } from '@/core/hooks/useSubjects';
import type { Subject } from '@/types/Subject';

type LoadStatus = 'loading' | 'invalid' | 'not-found' | 'ready' | 'deleting';

export default function SubjectDeletePage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getSubjectById, deleteSubject } = useSubjects();

  const subjectId = Number(params.id);

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [subject, setSubject] = useState<Subject | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId || Number.isNaN(subjectId)) {
      setStatus('invalid');
      return;
    }

    const found = getSubjectById(subjectId);
    if (!found) {
      setStatus('not-found');
      return;
    }

    setSubject(found);
    setStatus('ready');
  }, [subjectId, getSubjectById]);

  const goBackToList = (): void => {
    router.push('/subjects');
  };

  const handleConfirmDelete = (): void => {
    if (!subjectId || Number.isNaN(subjectId)) {
      setStatus('invalid');
      return;
    }

    try {
      setStatus('deleting');
      deleteSubject(subjectId);
      router.push('/subjects');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        'Ocorreu um erro ao remover a disciplina. Tente novamente em instantes.',
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
            Buscando informações da disciplina para confirmar a exclusão.
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
            disciplinas e tente novamente.
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

  if (status === 'not-found' || !subject) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Disciplina não encontrada</p>
          <p className={styles.stateSubtitle}>
            Não foi possível localizar uma disciplina com este identificador.
            Ela pode ter sido removida recentemente.
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

  const {
    id,
    name,
    description,
    workloadHours,
  } = subject;

  const descriptionPreview =
    description && description.trim().length > 0
      ? description.trim()
      : 'Disciplina sem descrição cadastrada.';

  // ===== Conteúdo principal =====

  return (
    <div className={styles.page}>
      {/* Header alinhado com DeleteTeacher / DeleteStudent */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaExclamationTriangle className={styles.titleIcon} />
            </span>
            Remover disciplina
          </h1>

          <p className={styles.subtitle}>
            Esta operação remove permanentemente o cadastro da disciplina da sua
            base de dados operacional. Verifique com cuidado antes de confirmar,
            pois o vínculo pode impactar turmas e matrículas.
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
                Tem certeza que deseja remover esta disciplina?
              </p>
              <p className={styles.warningSubtitle}>
                Após a confirmação, o registro será excluído e não poderá ser
                restaurado pela interface do sistema. Em um cenário real,
                recomenda-se revisar turmas e matrículas vinculadas antes de
                concluir esta ação.
              </p>
            </div>
          </div>

          {/* Resumo da disciplina */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div>
                <p className={styles.summaryLabel}>Disciplina</p>
                <p className={styles.summaryName}>{name}</p>
              </div>
              <span className={styles.summaryId}>#{id}</span>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Carga horária</span>
                <span className={styles.summaryItemValue}>
                  {typeof workloadHours === 'number' && !Number.isNaN(workloadHours)
                    ? `${workloadHours}h`
                    : 'Não informada'}
                </span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Descrição</span>
                <span className={styles.summaryItemValue}>
                  {descriptionPreview}
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
