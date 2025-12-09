// src/app/(dashboard)/classrooms/details/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaChalkboardTeacher,
  FaUsers,
  FaClock,
  FaArrowLeft,
  FaIdCard,
  FaCalendarAlt,
} from 'react-icons/fa';

import styles from './DetailsPage.module.css';

import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { useClassRooms } from '@/core/hooks/useClassRooms';

type DetailState = {
  id: number;
  name: string;
  schedule: string;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function ClassRoomDetailsPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { findById } = useClassRooms();

  const numericId = Number(params?.id);

  const [classRoom, setClassRoom] = useState<DetailState | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const found = findById(numericId);

    if (!found) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setClassRoom({
      id: found.id,
      name: found.name,
      schedule: found.schedule,
      capacity: found.capacity ?? 0,
      createdAt: found.createdAt,
      // se não houver updatedAt (dados antigos), usa createdAt como fallback
      updatedAt: found.updatedAt ?? found.createdAt,
    });

    setLoading(false);
  }, [numericId, findById]);

  const handleBack = (): void => {
    router.push('/classrooms');
  };

  const handleEdit = (): void => {
    if (!classRoom) return;
    router.push(`/classrooms/edit/${classRoom.id}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando turma...</p>
      </div>
    );
  }

  if (notFound || !classRoom) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Turma não encontrada</h1>
          <p className={styles.notFoundSubtitle}>
            Não encontramos nenhuma turma para o identificador informado.
            Verifique se o link está correto ou tente voltar para a listagem.
          </p>

          <div className={styles.notFoundActions}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleBack}
            >
              <FaArrowLeft />
              Voltar para turmas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const utilizationLabel =
    classRoom.capacity >= 40
      ? 'Alta capacidade (turma grande)'
      : classRoom.capacity >= 25
      ? 'Capacidade padrão'
      : 'Capacidade reduzida';

  const utilizationTag =
    classRoom.capacity >= 40
      ? 'Lotação alta'
      : classRoom.capacity >= 25
      ? 'Equilibrada'
      : 'Compacta';

  const createdAtFormatted = classRoom.createdAt
    ? new Date(classRoom.createdAt).toLocaleString('pt-BR')
    : '—';

  const updatedAtFormatted = classRoom.updatedAt
    ? new Date(classRoom.updatedAt).toLocaleString('pt-BR')
    : 'Nenhuma atualização registrada';

  return (
    <div className={styles.page}>
      {/* ===== Header (padronizado com students/teachers/subjects) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              <span className={styles.titleIconWrapper}>
                <FaChalkboardTeacher className={styles.titleIcon} />
              </span>
              {classRoom.name}
            </h1>

            <div className={styles.badgesRow}>
              <Badge size="md" variant="info">
                <FaClock />
                {classRoom.schedule || 'Horário não informado'}
              </Badge>

              <Badge size="md" variant="neutral">
                <FaUsers />
                Capacidade: {classRoom.capacity} alunos
              </Badge>
            </div>
          </div>

          <p className={styles.subtitle}>
            Visão detalhada da turma/sala. Use essas informações para organizar
            matrículas, remanejamento de alunos e planejamento de horários.
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
            <FaChalkboardTeacher />
            Editar turma
          </Button>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <section className={styles.grid}>
        {/* Coluna principal */}
        <Card className={styles.mainCard}>
          <h2 className={styles.sectionTitle}>Informações principais</h2>
          <p className={styles.sectionSubtitle}>
            Dados gerais da turma usados em turmas, matrículas e relatórios
            operacionais.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Identificador interno</h3>
              <p className={styles.infoValue}>#{classRoom.id}</p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Nome da turma / sala</h3>
              <p className={styles.infoValue}>{classRoom.name}</p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Horário / turno</h3>
              <p className={styles.infoValue}>
                {classRoom.schedule || 'Não informado'}
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Capacidade máxima</h3>
              <p className={styles.infoValue}>
                {classRoom.capacity} alunos
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
            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Última atualização</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{updatedAtFormatted}</span>
              </p>
            </div>

            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Perfil da turma</h3>
              <p className={styles.infoValue}>{utilizationLabel}</p>
            </div>
          </div>
        </Card>

        {/* Coluna lateral */}
        <div className={styles.sideColumn}>
          <Card className={styles.metaCard}>
            <h2 className={styles.sectionTitle}>Resumo operacional</h2>
            <p className={styles.sectionSubtitle}>
              Visão rápida dos dados essenciais para gestão da turma.
            </p>

            <dl className={styles.metaList}>
              <div className={styles.metaRow}>
                <dt>ID interno</dt>
                <dd>
                  <span className={styles.metaValue}>
                    <FaIdCard className={styles.metaIcon} />
                    <span>#{classRoom.id}</span>
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Capacidade &amp; lotação</dt>
                <dd>
                  <span className={styles.metaValueStack}>
                    <span>
                      {classRoom.capacity} alunos — {utilizationLabel}
                    </span>
                    <span className={styles.metaSub}>
                      Tag operacional: {utilizationTag}.
                    </span>
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Uso no sistema</dt>
                <dd>
                  <span className={styles.metaValueStack}>
                    <span>
                      Referência em matrículas, alocação de professores,
                      disciplinas e relatórios de ocupação.
                    </span>
                    <span className={styles.metaSub}>
                      Manter esses dados atualizados evita superlotação e
                      conflitos de horário.
                    </span>
                  </span>
                </dd>
              </div>
            </dl>

            <div className={styles.metaFooter}>
              <p className={styles.metaHint}>
                Essas informações são usadas pela secretaria e coordenação
                para decisão de abertura de novas turmas, remanejamento
                e planejamento de capacidade.
              </p>
            </div>
          </Card>

          <Card className={styles.auditCard}>
            <h2 className={styles.sectionTitle}>Status de ocupação</h2>
            <p className={styles.sectionSubtitle}>
              Recomendações para uso desta turma na rotina da escola.
            </p>

            <ul className={styles.auditList}>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Planejamento de matrículas
                </span>
                <span className={styles.auditValue}>
                  Use a capacidade como limite prático ao criar matrículas,
                  evitando turmas superlotadas e remanejamentos de última hora.
                </span>
              </li>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Organização de horários
                </span>
                <span className={styles.auditValue}>
                  O horário/turno orienta a distribuição de professores,
                  disciplinas e uso de outros espaços físicos.
                </span>
              </li>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Apoio ao remanejamento
                </span>
                <span className={styles.auditValue}>
                  Turmas com capacidade maior podem ser usadas estrategicamente
                  em períodos de alta demanda para redistribuição de alunos.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <p className={styles.footerLabel}>Ações rápidas</p>
          <p className={styles.footerHint}>
            Você pode voltar para a listagem de turmas ou seguir direto para
            edição desta sala.
          </p>
        </div>

        <div className={styles.footerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
          >
            Voltar para turmas
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleEdit}
          >
            Editar turma
          </Button>
        </div>
      </div>
    </div>
  );
}
