// src/app/(dashboard)/enrollments/delete/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

import styles from './DeletePage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useEnrollments } from '@/core/hooks/useEnrollments';
import { useStudents } from '@/core/hooks/useStudents';
import { useClassRooms } from '@/core/hooks/useClassRooms';
import { formatDate } from '@/core/utils/formatDate';
import type { EnrollmentStatus } from '@/types/Enrollment';

function getStatusLabel(status: EnrollmentStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'Ativa';
    case 'PENDING':
      return 'Pendente';
    case 'CANCELLED':
      return 'Cancelada';
    default:
      return status;
  }
}

function getStatusVariant(
  status: EnrollmentStatus | undefined,
): 'success' | 'warning' | 'danger' | 'neutral' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'neutral';
  }
}

type LoadStatus = 'loading' | 'invalid' | 'not-found' | 'ready' | 'deleting';

type EnrollmentSummary = {
  id: number;
  enrollmentDate: string;
  status: EnrollmentStatus;
  studentName?: string;
  studentId?: number;
  studentEmail?: string;
  classRoomName?: string;
  classRoomPeriod?: string;
};

export default function EnrollmentDeletePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();

  const { getEnrollmentById, deleteEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [summary, setSummary] = useState<EnrollmentSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const numericId = Number(idParam);

  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) {
      setStatus('invalid');
      return;
    }

    const enrollment = getEnrollmentById(numericId);

    if (!enrollment) {
      setStatus('not-found');
      return;
    }

    const student = students.find((s) => s.id === enrollment.studentId);
    const classRoom = classRooms.find((c) => c.id === enrollment.classRoomId);
    const normalizedStatus: EnrollmentStatus =
      (enrollment.status as EnrollmentStatus) ?? 'PENDING';

    setSummary({
      id: enrollment.id,
      enrollmentDate: enrollment.enrollmentDate,
      status: normalizedStatus,
      studentName: student?.name,
      studentId: student?.id,
      studentEmail: student?.email,
      classRoomName: classRoom?.name,
      classRoomPeriod: classRoom?.period,
    });

    setStatus('ready');
  }, [numericId, getEnrollmentById, students, classRooms]);

  const goBackToList = (): void => {
    router.push('/enrollments');
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!summary || status === 'deleting') return;

    try {
      setStatus('deleting');
      await deleteEnrollment(summary.id);
      router.push('/enrollments');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        'Ocorreu um erro ao remover a matrícula. Tente novamente em instantes.',
      );
      setStatus('ready');
    }
  };

  const isDeleting = status === 'deleting';
  const statusVariant = getStatusVariant(summary?.status);
  const statusLabel = summary ? getStatusLabel(summary.status) : '—';

  // ===== Estados especiais =====

  if (status === 'loading') {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Carregando dados...</p>
          <p className={styles.stateSubtitle}>
            Buscando informações da matrícula para confirmar a exclusão.
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
            matrículas e tente novamente.
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

  if (status === 'not-found' || !summary) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Matrícula não encontrada</p>
          <p className={styles.stateSubtitle}>
            Não foi possível localizar uma matrícula com este identificador. Ela
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
      {/* Header alinhado com os outros deletes (Teacher / Student / Subject / ClassRoom) */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaExclamationTriangle className={styles.titleIcon} />
            </span>
            Remover matrícula
          </h1>

          <p className={styles.subtitle}>
            Esta operação remove permanentemente o vínculo do aluno com a turma
            atual. Verifique com cuidado antes de confirmar, pois isso impacta
            relatórios, indicadores e a visão operacional da secretaria.
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
                Tem certeza que deseja remover esta matrícula?
              </p>
              <p className={styles.warningSubtitle}>
                Após a confirmação, a matrícula será excluída e não poderá ser
                restaurada pela interface do sistema. Em um cenário real, essa
                ação costuma ser usada apenas para correção de lançamentos
                equivocados ou cancelamentos definitivos.
              </p>
            </div>
          </div>

          {/* Resumo da matrícula */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div>
                <p className={styles.summaryLabel}>Matrícula</p>
                <p className={styles.summaryName}>#{summary.id}</p>
              </div>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Aluno</span>
                <span className={styles.summaryItemValue}>
                  {summary.studentName ?? 'Não informado'}
                </span>
                <span className={styles.summaryMeta}>
                  ID:{' '}
                  {summary.studentId !== undefined
                    ? summary.studentId
                    : '—'}
                  {summary.studentEmail && (
                    <>
                      {' • '}
                      {summary.studentEmail}
                    </>
                  )}
                </span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Turma</span>
                <span className={styles.summaryItemValue}>
                  {summary.classRoomName ?? 'Não vinculada'}
                </span>
                <span className={styles.summaryMeta}>
                  {summary.classRoomPeriod ?? 'Período não cadastrado'}
                </span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>
                  Data de matrícula
                </span>
                <span className={styles.summaryItemValue}>
                  {formatDate(summary.enrollmentDate)}
                </span>
                <span className={styles.summaryMeta}>
                  Registro original desta matrícula no sistema.
                </span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Status atual</span>
                <span className={styles.summaryValueInline}>
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                </span>
                <span className={styles.summaryMeta}>
                  Este status deixará de ser contabilizado nos dashboards após a
                  exclusão.
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
