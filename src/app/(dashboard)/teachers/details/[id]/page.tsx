// src/app/(dashboard)/teachers/details/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaChalkboardTeacher,
} from 'react-icons/fa';

import styles from './DetailsPage.module.css';

import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { useTeachers } from '@/core/hooks/useTeachers';
import type { Teacher } from '@/types/Teacher';
import { formatDate } from '@/core/utils/formatDate';

export default function TeacherDetailsPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params?.id);

  const { getTeacherById } = useTeachers();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const found = getTeacherById(id);

    if (!found) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setTeacher(found);
    setLoading(false);
  }, [id, getTeacherById]);

  const handleBack = (): void => {
    router.push('/teachers');
  };

  const handleEdit = (): void => {
    if (!id || notFound) return;
    router.push(`/teachers/edit/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando professor...</p>
      </div>
    );
  }

  if (notFound || !teacher) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Professor não encontrado</h1>
          <p className={styles.notFoundSubtitle}>
            Não encontramos nenhum professor para o identificador informado.
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
              Voltar para professores
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const dateOfBirthFormatted = teacher.dateOfBirth
    ? formatDate(teacher.dateOfBirth)
    : '—';

  const createdAtFormatted = teacher.createdAt
    ? new Date(teacher.createdAt).toLocaleString('pt-BR')
    : '—';

  const updatedAtFormatted = teacher.updatedAt
    ? new Date(teacher.updatedAt).toLocaleString('pt-BR')
    : 'Nenhuma atualização registrada';

  return (
    <div className={styles.page}>
      {/* ===== Header (padronizado com StudentsDetails) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              <span className={styles.titleIconWrapper}>
                <FaChalkboardTeacher className={styles.titleIcon} />
              </span>
              {teacher.name}
            </h1>

            <div className={styles.badgesRow}>
              {teacher.subject && (
                <Badge size="md" variant="info">
                  {teacher.subject}
                </Badge>
              )}
            </div>
          </div>

          <p className={styles.subtitle}>
            Dados completos do professor para suporte à secretaria, coordenação
            e organização da grade de aulas.
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
            Editar professor
          </Button>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <section className={styles.grid}>
        {/* Coluna principal */}
        <Card className={styles.mainCard}>
          <h2 className={styles.sectionTitle}>Informações principais</h2>
          <p className={styles.sectionSubtitle}>
            Identidade institucional e dados principais de contato do professor.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Nome completo</h3>
              <p className={styles.infoValue}>{teacher.name}</p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Disciplina principal</h3>
              <p className={styles.infoValue}>
                {teacher.subject || 'Não informada'}
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>E-mail</h3>
              <p className={styles.infoValueInline}>
                <FaEnvelope className={styles.infoIcon} />
                <span>{teacher.email || '—'}</span>
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Telefone</h3>
              <p className={styles.infoValueInline}>
                <FaPhone className={styles.infoIcon} />
                <span>{teacher.phone || '—'}</span>
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Data de nascimento</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{dateOfBirthFormatted}</span>
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

            {/* 🆕 Última atualização em linha cheia */}
            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Última atualização</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{updatedAtFormatted}</span>
              </p>
            </div>

            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Endereço</h3>
              <p className={styles.infoValue}>
                {teacher.address || 'Não informado'}
              </p>
            </div>
          </div>
        </Card>

        {/* Coluna lateral (mesmo layout do StudentsDetails) */}
        <div className={styles.sideColumn}>
          <Card className={styles.metaCard}>
            <h2 className={styles.sectionTitle}>Resumo institucional</h2>
            <p className={styles.sectionSubtitle}>
              Visão rápida dos dados essenciais do professor no sistema.
            </p>

            <dl className={styles.metaList}>
              <div className={styles.metaRow}>
                <dt>ID interno</dt>
                <dd>
                  <span className={styles.metaValue}>
                    <FaIdCard className={styles.metaIcon} />
                    <span>#{teacher.id}</span>
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Disciplina principal</dt>
                <dd>
                  <span className={styles.metaValue}>
                    {teacher.subject || 'Não informada'}
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Contato principal</dt>
                <dd>
                  <span className={styles.metaValueStack}>
                    <span>
                      {teacher.email || 'E-mail não informado'}
                    </span>
                    <span className={styles.metaSub}>
                      {teacher.phone || 'Telefone não informado'}
                    </span>
                  </span>
                </dd>
              </div>
            </dl>

            <div className={styles.metaFooter}>
              <p className={styles.metaHint}>
                Esses dados são usados na alocação de turmas, planejamento
                de horários e comunicação com o corpo docente.
              </p>
            </div>
          </Card>

          <Card className={styles.auditCard}>
            <h2 className={styles.sectionTitle}>Status operacional</h2>
            <p className={styles.sectionSubtitle}>
              Informações para suporte na gestão diária da escola.
            </p>

            <ul className={styles.auditList}>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Alocação em turmas
                </span>
                <span className={styles.auditValue}>
                  Os dados deste professor são utilizados nas telas de turmas,
                  grade horária e relatórios pedagógicos.
                </span>
              </li>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Consistência de dados
                </span>
                <span className={styles.auditValue}>
                  Manter e-mail, telefone e endereço atualizados facilita
                  comunicação, avisos e organização de reuniões.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
