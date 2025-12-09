// src/app/(dashboard)/enrollments/details/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaGraduationCap,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaIdCard,
} from 'react-icons/fa';

import styles from './DetailsPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useEnrollments } from '@/core/hooks/useEnrollments';
import { useStudents } from '@/core/hooks/useStudents';
import { useClassRooms } from '@/core/hooks/useClassRooms';
import { formatDate } from '@/core/utils/formatDate';
import type { Student } from '@/types/Student';
import type { ClassRoom } from '@/types/ClassRoom';
import type { Enrollment, EnrollmentStatus } from '@/types/Enrollment';

type LoadStatus = 'loading' | 'invalid' | 'not-found' | 'ready';

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

export default function EnrollmentDetailsPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const enrollmentId = Number(params?.id);

  const { getEnrollmentById } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);

  useEffect(() => {
    if (!enrollmentId || Number.isNaN(enrollmentId)) {
      setStatus('invalid');
      return;
    }

    const foundEnrollment = getEnrollmentById(enrollmentId);

    if (!foundEnrollment) {
      setStatus('not-found');
      return;
    }

    const foundStudent =
      students.find((s) => s.id === foundEnrollment.studentId) ?? null;
    const foundClassRoom =
      classRooms.find((c) => c.id === foundEnrollment.classRoomId) ?? null;

    setEnrollment(foundEnrollment);
    setStudent(foundStudent);
    setClassRoom(foundClassRoom);
    setStatus('ready');
  }, [enrollmentId, getEnrollmentById, students, classRooms]);

  const handleBack = (): void => {
    router.push('/enrollments');
  };

  const handleEdit = (): void => {
    if (!enrollment) return;
    router.push(`/enrollments/edit/${enrollment.id}`);
  };

  // ===== Estados de loading / erro =====

  if (status === 'loading') {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando matrícula...</p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>ID inválido</h1>
          <p className={styles.notFoundSubtitle}>
            O identificador informado não é válido. Volte para a lista de
            matrículas e tente novamente.
          </p>
          <div className={styles.notFoundActions}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleBack}
            >
              <FaArrowLeft />
              Voltar para matrículas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'not-found' || !enrollment) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Matrícula não encontrada</h1>
          <p className={styles.notFoundSubtitle}>
            Não encontramos nenhuma matrícula para o identificador informado.
            Ela pode ter sido removida ou o link está desatualizado.
          </p>

          <div className={styles.notFoundActions}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleBack}
            >
              <FaArrowLeft />
              Voltar para matrículas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ===== Conteúdo principal =====

  const currentStatus: EnrollmentStatus =
    (enrollment.status as EnrollmentStatus) ?? 'PENDING';
  const statusVariant = getStatusVariant(currentStatus);
  const statusLabel = getStatusLabel(currentStatus);

  const enrollmentDateFormatted = formatDate(enrollment.enrollmentDate);

  const createdAtFormatted = enrollment.createdAt
    ? new Date(enrollment.createdAt).toLocaleString('pt-BR')
    : '—';

  const updatedAtFormatted = enrollment.updatedAt
    ? new Date(enrollment.updatedAt).toLocaleString('pt-BR')
    : 'Nenhuma atualização registrada';

  return (
    <div className={styles.page}>
      {/* ===== Header (padronizado com students/teachers/classrooms/subjects) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              <span className={styles.titleIconWrapper}>
                <FaGraduationCap className={styles.titleIcon} />
              </span>
              Matrícula #{enrollment.id}
            </h1>

            <div className={styles.badgesRow}>
              <Badge size="md" variant={statusVariant}>
                {statusLabel}
              </Badge>
            </div>
          </div>

          <p className={styles.subtitle}>
            Visão consolidada da matrícula, unindo contexto do aluno, turma e
            status operacional. Layout alinhado às demais telas de detalhes do
            painel acadêmico.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Voltar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleEdit}
          >
            <FaGraduationCap />
            Editar matrícula
          </Button>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <section className={styles.grid}>
        {/* Coluna principal */}
        <Card className={styles.mainCard}>
          <h2 className={styles.sectionTitle}>Informações da matrícula</h2>
          <p className={styles.sectionSubtitle}>
            Dados gerais usados em relatórios, visão operacional e conferência
            do vínculo entre aluno e turma.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Aluno</h3>
              <p className={styles.infoValueInline}>
                <FaUser className={styles.infoIcon} />
                <span>{student?.name ?? 'Não informado'}</span>
              </p>
              <p className={styles.infoMeta}>
                ID: {student?.id ?? '—'}
                {student?.email && (
                  <>
                    <span className={styles.infoMetaSeparator}>•</span>
                    <span>{student.email}</span>
                  </>
                )}
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Turma / sala</h3>
              <p className={styles.infoValue}>
                {classRoom?.name ?? 'Não vinculada'}
              </p>
              <p className={styles.infoMeta}>
                {classRoom?.schedule && <span>{classRoom.schedule}</span>}
                {classRoom?.capacity && (
                  <>
                    <span className={styles.infoMetaSeparator}>•</span>
                    <span>Capacidade: {classRoom.capacity} alunos</span>
                  </>
                )}
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Data de matrícula</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{enrollmentDateFormatted}</span>
              </p>
              <p className={styles.infoMeta}>
                Registro fixado na linha do tempo acadêmica do aluno.
              </p>
            </div>

            {/* 🆕 Criado em */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Criado em</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{createdAtFormatted}</span>
              </p>
            </div>

            {/* 🆕 Última atualização */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Última atualização</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{updatedAtFormatted}</span>
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Status</h3>
              <p className={styles.infoValueInline}>
                <Badge variant={statusVariant}>{statusLabel}</Badge>
              </p>
              <p className={styles.infoMeta}>
                {currentStatus === 'ACTIVE' &&
                  'Conta como aluno ativo na turma e nos relatórios de ocupação.'}
                {currentStatus === 'PENDING' &&
                  'Pré-matrícula em análise. Ainda não considerar como totalmente alocado.'}
                {currentStatus === 'CANCELLED' &&
                  'Vínculo encerrado. Não contabilizar como aluno ativo nesta turma.'}
              </p>
            </div>

            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Resumo operacional</h3>
              <p className={styles.infoValue}>
                Esta matrícula conecta um aluno específico a uma turma em uma
                data definida, com um status que orienta contagens em turmas,
                relatórios e visão diária da secretaria.
              </p>
            </div>
          </div>
        </Card>

        {/* Coluna lateral */}
        <div className={styles.sideColumn}>
          <Card className={styles.metaCard}>
            <h2 className={styles.sectionTitle}>Resumo de sistema</h2>
            <p className={styles.sectionSubtitle}>
              Como esta matrícula aparece nas demais telas do painel.
            </p>

            <dl className={styles.metaList}>
              <div className={styles.metaRow}>
                <dt>ID interno</dt>
                <dd>
                  <span className={styles.metaValue}>
                    <FaIdCard className={styles.metaIcon} />
                    <span>#{enrollment.id}</span>
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Aluno / Turma</dt>
                <dd>
                  <span className={styles.metaValueStack}>
                    <span>
                      {student?.name ?? 'Aluno não vinculado'}{' '}
                      {classRoom?.name
                        ? `• ${classRoom.name}`
                        : '• Turma não vinculada'}
                    </span>
                    <span className={styles.metaSub}>
                      Esses dados são usados em filtros e buscas da área de
                      matrículas.
                    </span>
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Status atual</dt>
                <dd>
                  <span className={styles.metaValueStack}>
                    <span>{statusLabel}</span>
                    <span className={styles.metaSub}>
                      Impacta contagem de alunos ativos por turma e visão
                      gerencial da escola.
                    </span>
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Data de referência</dt>
                <dd>
                  <span className={styles.metaValueStack}>
                    <span>{enrollmentDateFormatted}</span>
                    <span className={styles.metaSub}>
                      Marco usado em relatórios de linha do tempo acadêmica.
                    </span>
                  </span>
                </dd>
              </div>
            </dl>

            <div className={styles.metaFooter}>
              <p className={styles.metaHint}>
                Manter aluno, turma, data e status corretos evita divergências
                entre relatórios, painel de matrículas e visão de ocupação de
                turmas.
              </p>
            </div>
          </Card>

          <Card className={styles.auditCard}>
            <h2 className={styles.sectionTitle}>Boas práticas de gestão</h2>
            <p className={styles.sectionSubtitle}>
              Recomendações para manter o histórico desta matrícula confiável.
            </p>

            <ul className={styles.auditList}>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Conferência de dados
                </span>
                <span className={styles.auditValue}>
                  Antes de confirmar a matrícula, valide se aluno, turma e data
                  estão corretos. Isso reduz retrabalho e ajustes posteriores.
                </span>
              </li>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Atualização de status
                </span>
                <span className={styles.auditValue}>
                  Sempre que houver cancelamento, transferência ou pendência,
                  atualize o status para manter os relatórios alinhados à
                  realidade.
                </span>
              </li>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Uso em relatórios
                </span>
                <span className={styles.auditValue}>
                  As informações desta tela são base para relatórios de
                  ocupação, evasão, retenção e histórico de matrículas.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* ===== Footer (ações rápidas) ===== */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <p className={styles.footerLabel}>Ações rápidas</p>
          <p className={styles.footerHint}>
            Você pode voltar para a listagem de matrículas ou seguir direto para
            edição deste vínculo.
          </p>
        </div>

        <div className={styles.footerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
          >
            Voltar para matrículas
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleEdit}
          >
            Editar matrícula
          </Button>
        </div>
      </div>
    </div>
  );
}
