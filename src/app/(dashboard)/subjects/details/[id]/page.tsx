// src/app/(dashboard)/subjects/details/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaBook,
  FaClock,
  FaIdCard,
  FaCalendarAlt,
} from 'react-icons/fa';

import styles from './DetailsPage.module.css';

import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { useSubjects } from '@/core/hooks/useSubjects';
import type { Subject } from '@/types/Subject';

export default function SubjectDetailsPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params?.id);

  const { getSubjectById } = useSubjects();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const found = getSubjectById(id);

    if (!found) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setSubject(found);
    setLoading(false);
  }, [id, getSubjectById]);

  const handleBack = (): void => {
    router.push('/subjects');
  };

  const handleEdit = (): void => {
    if (!id || notFound) return;
    router.push(`/subjects/edit/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando disciplina...</p>
      </div>
    );
  }

  if (notFound || !subject) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Disciplina não encontrada</h1>
          <p className={styles.notFoundSubtitle}>
            Não encontramos nenhuma disciplina para o identificador informado.
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
              Voltar para disciplinas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const createdAtFormatted = subject.createdAt
    ? new Date(subject.createdAt).toLocaleString('pt-BR')
    : '—';

  const updatedAtFormatted = subject.updatedAt
    ? new Date(subject.updatedAt).toLocaleString('pt-BR')
    : 'Nenhuma atualização registrada';

  return (
    <div className={styles.page}>
      {/* ===== Header (padronizado com students/teachers) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              <span className={styles.titleIconWrapper}>
                <FaBook className={styles.titleIcon} />
              </span>
              {subject.name}
            </h1>

            <div className={styles.badgesRow}>
              {typeof subject.workloadHours === 'number' ? (
                <Badge size="md" variant="info">
                  <FaClock />
                  {subject.workloadHours}h de carga horária
                </Badge>
              ) : (
                <Badge size="md" variant="neutral">
                  Carga horária não informada
                </Badge>
              )}
            </div>
          </div>

          <p className={styles.subtitle}>
            Dados completos da disciplina para suporte à secretaria,
            coordenação pedagógica e organização da grade curricular.
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
            <FaBook />
            Editar disciplina
          </Button>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <section className={styles.grid}>
        {/* Coluna principal */}
        <Card className={styles.mainCard}>
          <h2 className={styles.sectionTitle}>Informações principais</h2>
          <p className={styles.sectionSubtitle}>
            Dados gerais da disciplina utilizados em turmas, matrículas
            e relatórios acadêmicos.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Nome da disciplina</h3>
              <p className={styles.infoValue}>{subject.name}</p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Carga horária (horas)</h3>
              <p className={styles.infoValue}>
                {typeof subject.workloadHours === 'number'
                  ? `${subject.workloadHours}h`
                  : 'Não informada'}
              </p>
            </div>

            {/* 🆕 Criado em */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Criado em</h3>
              <p className={styles.infoValue}>
                <span className={styles.infoValueInline}>
                  <FaCalendarAlt className={styles.infoIcon} />
                  <span>{createdAtFormatted}</span>
                </span>
              </p>
            </div>

            {/* 🆕 Última atualização */}
            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Última atualização</h3>
              <p className={styles.infoValue}>
                <span className={styles.infoValueInline}>
                  <FaCalendarAlt className={styles.infoIcon} />
                  <span>{updatedAtFormatted}</span>
                </span>
              </p>
            </div>

            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Descrição</h3>
              <p className={styles.infoValue}>
                {subject.description?.trim()
                  ? subject.description
                  : 'Nenhuma descrição cadastrada para esta disciplina.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Coluna lateral (meta + status) */}
        <div className={styles.sideColumn}>
          <Card className={styles.metaCard}>
            <h2 className={styles.sectionTitle}>Resumo acadêmico</h2>
            <p className={styles.sectionSubtitle}>
              Visão rápida dos dados essenciais da disciplina no sistema.
            </p>

            <dl className={styles.metaList}>
              <div className={styles.metaRow}>
                <dt>ID interno</dt>
                <dd>
                  <span className={styles.metaValue}>
                    <FaIdCard className={styles.metaIcon} />
                    <span>#{subject.id}</span>
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Carga horária</dt>
                <dd>
                  <span className={styles.metaValue}>
                    {typeof subject.workloadHours === 'number'
                      ? `${subject.workloadHours}h`
                      : 'Não informada'}
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Uso na grade</dt>
                <dd>
                  <span className={styles.metaValueStack}>
                    <span>
                      Utilizada na definição de turmas, horários
                      e relatórios de carga horária.
                    </span>
                    <span className={styles.metaSub}>
                      Recomenda-se manter estes dados sempre atualizados
                      para evitar inconsistências acadêmicas.
                    </span>
                  </span>
                </dd>
              </div>
            </dl>

            <div className={styles.metaFooter}>
              <p className={styles.metaHint}>
                Essas informações são referência para coordenação e secretaria
                na montagem da grade curricular e planejamento de aulas.
              </p>
            </div>
          </Card>

          <Card className={styles.auditCard}>
            <h2 className={styles.sectionTitle}>Status operacional</h2>
            <p className={styles.sectionSubtitle}>
              Contexto de uso da disciplina na gestão diária da escola.
            </p>

            <ul className={styles.auditList}>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Relação com turmas
                </span>
                <span className={styles.auditValue}>
                  Esta disciplina é associada a turmas e professores nas telas
                  de turmas e matrículas, impactando relatórios acadêmicos.
                </span>
              </li>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Documentação pedagógica
                </span>
                <span className={styles.auditValue}>
                  Uma boa descrição ajuda professores, coordenação e secretaria
                  a entenderem objetivos, conteúdos e público-alvo rapidamente.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
